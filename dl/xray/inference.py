import sys
import json
import base64
import argparse
import io
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

import numpy as np
import torch
from PIL import Image

from main_pytorch import (
    DenseNet121Pneumonia,
    PyTorchGradCAM,
    overlay_cam,
    get_eval_transform,
)

CKPT_PATH = BASE_DIR / "outputs" / "models" / "best_model_pytorch.pth"
IMG_SIZE = 224
eval_transform = get_eval_transform(IMG_SIZE)


def encode_heatmap_base64(overlay_rgb: np.ndarray) -> str:
    pil_img = Image.fromarray(overlay_rgb)
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def load_trained_model(device: torch.device):
    if not CKPT_PATH.exists():
        raise FileNotFoundError(f"Trained checkpoint not found at {CKPT_PATH}")
    checkpoint = torch.load(str(CKPT_PATH), map_location=device, weights_only=False)
    model = DenseNet121Pneumonia(pretrained=False).to(device)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()
    threshold = float(checkpoint.get("best_threshold", 0.5))
    return model, threshold


def predict_with_model(model, gradcam, device, image_path: str, threshold: float = 0.5) -> dict:
    orig_img = Image.open(image_path).convert("RGB")
    tensor_img = eval_transform(orig_img).unsqueeze(0).to(device)

    cam, prob_pneumonia = gradcam.generate(tensor_img)
    prob_normal = 1.0 - prob_pneumonia

    predicted_class = "Pneumonia" if prob_pneumonia >= threshold else "Normal"
    scores = {
        "Normal": round(prob_normal, 4),
        "Pneumonia": round(prob_pneumonia, 4),
    }

    heatmap_b64 = None
    try:
        resized_orig = np.array(orig_img.resize((IMG_SIZE, IMG_SIZE)))
        overlay_rgb = overlay_cam(resized_orig, cam)
        heatmap_b64 = encode_heatmap_base64(overlay_rgb)
    except Exception as e:
        print(f"[WARN] Grad-CAM failed: {e}", file=sys.stderr)

    return {
        "modality": "xray",
        "predicted_class": predicted_class,
        "confidence": scores[predicted_class],
        "scores": scores,
        "threshold_used": round(threshold, 4),
        "model_name": "densenet121-xray",
        "explanation": {
            "available": heatmap_b64 is not None,
            "type": "gradcam" if heatmap_b64 is not None else "none",
            "heatmap_base64": heatmap_b64,
        },
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="Path to chest X-ray image")
    args = parser.parse_args()

    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    model, threshold = load_trained_model(device)
    gradcam = PyTorchGradCAM(model, model.get_last_conv_layer())

    result = predict_with_model(model, gradcam, device, args.image, threshold=threshold)
    print(json.dumps(result))
