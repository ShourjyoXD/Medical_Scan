import time, argparse, logging
from pathlib import Path
from typing import Tuple
import cv2, yaml, numpy as np, torch, torch.nn as nn
from torch.utils.data import DataLoader, Dataset, WeightedRandomSampler
from torchvision import transforms, models
from PIL import Image
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, roc_curve, confusion_matrix

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s", datefmt="%H:%M:%S")
logger = logging.getLogger(__name__)
CLASSES = ["Normal", "Pneumonia"]

def load_config(path=None):
    base_dir = Path(__file__).resolve().parent
    config_path = (base_dir / "configs" / "config.yaml") if (not path or path == "configs/config.yaml") else Path(path)
    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)
    if not Path(config["data"]["root_dir"]).is_absolute():
        config["data"]["root_dir"] = str(base_dir / config["data"]["root_dir"])
    for k in ["model_dir", "log_dir", "viz_dir", "reports_dir"]:
        if not Path(config["output"][k]).is_absolute():
            config["output"][k] = str(base_dir / config["output"][k])
    return config

def get_device():
    return torch.device("cuda:0") if torch.cuda.is_available() else torch.device("cpu")

class DenseNet121Pneumonia(nn.Module):
    def __init__(self, pretrained=True, dropout=0.4):
        super().__init__()
        weights = models.DenseNet121_Weights.DEFAULT if pretrained else None
        self.densenet = models.densenet121(weights=weights)
        in_features = self.densenet.classifier.in_features
        self.densenet.classifier = nn.Sequential(nn.Dropout(p=dropout), nn.Linear(in_features, 1))

    def freeze_backbone(self):
        for p in self.densenet.features.parameters():
            p.requires_grad = False

    def unfreeze_top_blocks(self):
        for name, p in self.densenet.features.named_parameters():
            if any(b in name for b in ("denseblock3", "transition3", "denseblock4", "norm5")):
                p.requires_grad = True

    def forward(self, x):
        return self.densenet(x).squeeze(-1)

    def get_last_conv_layer(self):
        return self.densenet.features.norm5

class PyTorchGradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.gradients = None
        self.activations = None
        target_layer.register_forward_hook(self._forward_hook)

    def _forward_hook(self, module, inp, out):
        self.activations = out
        out.register_hook(self._save_gradient)

    def _save_gradient(self, grad):
        self.gradients = grad

    def generate(self, input_tensor):
        self.model.eval()
        self.gradients, self.activations = None, None
        output = self.model(input_tensor)
        prob = torch.sigmoid(output).item()
        self.model.zero_grad()
        output.backward(retain_graph=True)
        grads = self.gradients[0].cpu().data.numpy()
        acts = self.activations[0].cpu().data.numpy()
        weights = np.mean(grads, axis=(1, 2))
        cam = np.zeros(acts.shape[1:], dtype=np.float32)
        for i, w in enumerate(weights):
            cam += w * acts[i, :, :]
        cam = np.maximum(cam, 0)
        if np.max(cam) > 0:
            cam /= np.max(cam)
        return cv2.resize(cam, (224, 224)), prob

def overlay_cam(image_rgb, cam, alpha=0.4):
    heatmap = cv2.cvtColor(cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET), cv2.COLOR_BGR2RGB)
    return np.uint8(alpha * heatmap + (1 - alpha) * image_rgb)

class ChestXrayDataset(Dataset):
    def __init__(self, root_dir, split, transform=None):
        self.transform = transform
        self.samples = []
        for idx, cls in enumerate(["NORMAL", "PNEUMONIA"]):
            folder = Path(root_dir) / split / cls
            for ext in ("*.jpeg", "*.jpg", "*.png"):
                for p in folder.glob(ext):
                    self.samples.append((str(p), idx))
        self.labels = [s[1] for s in self.samples]

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        img = Image.open(path).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, torch.tensor(label, dtype=torch.float32), path

def get_eval_transform(img_size=224):
    return transforms.Compose([
        transforms.Resize(int(img_size * 1.12)),
        transforms.CenterCrop(img_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])

def get_dataloaders(config):
    root_dir, img_size, batch_size = config["data"]["root_dir"], config["data"]["image_size"], config["training"]["batch_size"]
    train_tf = transforms.Compose([
        transforms.RandomResizedCrop(img_size, scale=(0.80, 1.0), ratio=(0.9, 1.1)),
        transforms.RandomHorizontalFlip(0.5),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.15, contrast=0.15),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    eval_tf = get_eval_transform(img_size)
    train_ds = ChestXrayDataset(root_dir, "train", train_tf)
    val_ds = ChestXrayDataset(root_dir, "val", eval_tf)
    test_ds = ChestXrayDataset(root_dir, "test", eval_tf)

    labels = np.array(train_ds.labels)
    weights = (1.0 / np.bincount(labels))[labels]
    sampler = WeightedRandomSampler(weights, len(weights), replacement=True)

    return (
        DataLoader(train_ds, batch_size=batch_size, sampler=sampler, num_workers=0),
        DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=0),
        DataLoader(test_ds, batch_size=batch_size, shuffle=False, num_workers=0),
    )

def find_optimal_threshold(targets, probs):
    fpr, tpr, thresholds = roc_curve(targets, probs)
    idx = int(np.argmax(tpr - fpr))
    return float(np.clip(thresholds[idx], 0.2, 0.85))

def run_train(config):
    device = get_device()
    train_loader, val_loader, _ = get_dataloaders(config)
    model = DenseNet121Pneumonia(pretrained=True, dropout=0.4).to(device)

    warmup_epochs = 2
    total_epochs = config["training"].get("epochs", 6)
    model.freeze_backbone()
    criterion = nn.BCEWithLogitsLoss()
    optimizer = torch.optim.AdamW(model.densenet.classifier.parameters(), lr=1e-3, weight_decay=1e-3)

    ckpt_path = Path(config["output"]["model_dir"]) / "best_model_pytorch.pth"
    ckpt_path.parent.mkdir(parents=True, exist_ok=True)
    best_score = 0.0

    for epoch in range(1, total_epochs + 1):
        if epoch == warmup_epochs + 1:
            logger.info("Stage 2: Unfreezing denseblock3, denseblock4, norm5 at lr=3e-5")
            model.unfreeze_top_blocks()
            optimizer = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=3e-5, weight_decay=1e-3)

        model.train()
        train_loss, t0 = 0.0, time.time()
        for step, (imgs, targets, _) in enumerate(train_loader, 1):
            imgs, targets = imgs.to(device), targets.to(device)
            optimizer.zero_grad()
            loss = criterion(model(imgs), targets * 0.95 + 0.025)
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * len(targets)
            if step % 30 == 0:
                logger.info(f"  Epoch {epoch} | Batch {step}/{len(train_loader)} | Loss: {loss.item():.4f}")

        train_loss /= len(train_loader.dataset)
        model.eval()
        val_t, val_p = [], []
        with torch.no_grad():
            for imgs, targets, _ in val_loader:
                probs = torch.sigmoid(model(imgs.to(device)))
                val_t.extend(targets.numpy())
                val_p.extend(probs.cpu().numpy())

        val_t, val_p = np.array(val_t), np.array(val_p)
        thresh = find_optimal_threshold(val_t, val_p)
        preds = (val_p >= thresh).astype(int)
        acc, auc, f1 = accuracy_score(val_t, preds), roc_auc_score(val_t, val_p), f1_score(val_t, preds)
        logger.info(f"Epoch {epoch}/{total_epochs} [{time.time()-t0:.1f}s] | Loss: {train_loss:.4f} | Val ACC: {acc:.4f} | Val F1: {f1:.4f} | Val AUC: {auc:.4f} | Thresh: {thresh:.3f}")

        score = 0.5 * auc + 0.5 * f1
        if score >= best_score:
            best_score = score
            torch.save({"epoch": epoch, "model_state_dict": model.state_dict(), "val_auc": auc, "val_acc": acc, "val_f1": f1, "best_threshold": thresh, "config": config}, ckpt_path)
            logger.info(f"  -> Saved checkpoint to {ckpt_path}")

    run_evaluate(config, str(ckpt_path))

def run_evaluate(config, checkpoint_path):
    device = get_device()
    _, _, test_loader = get_dataloaders(config)
    ckpt = torch.load(checkpoint_path, map_location=device, weights_only=False)
    model = DenseNet121Pneumonia(pretrained=False).to(device)
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()
    thresh = ckpt.get("best_threshold", 0.5)

    all_t, all_p = [], []
    with torch.no_grad():
        for imgs, targets, _ in test_loader:
            all_t.extend(targets.numpy())
            all_p.extend(torch.sigmoid(model(imgs.to(device))).cpu().numpy())

    all_t, all_p = np.array(all_t), np.array(all_p)
    preds = (all_p >= thresh).astype(int)
    cm = confusion_matrix(all_t, preds)
    print(f"\nTEST REPORT (Threshold={thresh:.3f}) | ACC: {accuracy_score(all_t, preds):.4f} | F1: {f1_score(all_t, preds):.4f} | AUC: {roc_auc_score(all_t, all_p):.4f}")
    print(f"TN (Normal OK): {cm[0,0]} | FP (Normal->Pneum): {cm[0,1]} | FN (Missed Pneum): {cm[1,0]} | TP (Pneum OK): {cm[1,1]}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="configs/config.yaml")
    parser.add_argument("--mode", default="train", choices=["train", "evaluate"])
    parser.add_argument("--checkpoint", default="outputs/models/best_model_pytorch.pth")
    args = parser.parse_args()
    cfg = load_config(args.config)
    run_train(cfg) if args.mode == "train" else run_evaluate(cfg, args.checkpoint)
