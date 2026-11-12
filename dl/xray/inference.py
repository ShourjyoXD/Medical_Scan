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


def validate_chest_xray(pil_img: Image.Image) -> tuple[bool, str]:
    w, h = pil_img.size
    aspect = w / max(h, 1)
    if aspect < 0.55 or aspect > 1.85:
        return False, f"Invalid aspect ratio ({aspect:.2f}) for a chest radiograph."

    arr = np.asarray(pil_img.resize((224, 224)), dtype=np.float32) / 255.0

    # 1. Color saturation check: X-rays are grayscale (R ≈ G ≈ B)
    channel_spread = np.max(arr, axis=2) - np.min(arr, axis=2)
    mean_saturation = float(np.mean(channel_spread))
    high_color_ratio = float(np.mean(channel_spread > 0.12))
    if mean_saturation > 0.06 or high_color_ratio > 0.10:
        return False, "Uploaded image contains color saturation and is not a grayscale chest X-ray."

    # 2. Radiograph luminance distribution check (avoid solid black/white or flat graphics)
    gray = np.mean(arr, axis=2)
    std_lum = float(np.std(gray))
    if std_lum < 0.08:
        return False, "Image contrast is too uniform to be a valid chest radiograph."

    return True, "OK"


def calibrate_scores(prob_pneumonia: float, threshold: float) -> tuple[float, float]:
    # Piecewise linear rescaling so threshold maps to 0.50 for clean UI confidence bars
    if prob_pneumonia >= threshold:
        cal_pneu = 0.5 + 0.5 * ((prob_pneumonia - threshold) / max(1.0 - threshold, 1e-6))
    else:
        cal_pneu = 0.5 * (prob_pneumonia / max(threshold, 1e-6))
    cal_pneu = float(np.clip(cal_pneu, 0.0001, 0.9999))
    return round(1.0 - cal_pneu, 4), round(cal_pneu, 4)


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

    is_valid, reason = validate_chest_xray(orig_img)
    if not is_valid:
        raise ValueError(f"Invalid chest X-ray image: {reason}")

    tensor_img = eval_transform(orig_img).unsqueeze(0).to(device)
    cam, prob_pneumonia = gradcam.generate(tensor_img)

    predicted_class = "Pneumonia" if prob_pneumonia >= threshold else "Normal"
    norm_score, pneu_score = calibrate_scores(prob_pneumonia, threshold)
    scores = {
        "Normal": norm_score,
        "Pneumonia": pneu_score,
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
        "raw_pneumonia_prob": round(prob_pneumonia, 4),
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

    try:
        result = predict_with_model(model, gradcam, device, args.image, threshold=threshold)
        print(json.dumps(result))
    except ValueError as ve:
        print(json.dumps({"error": str(ve)}), file=sys.stderr)
        sys.exit(2)
