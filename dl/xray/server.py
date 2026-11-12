import sys
import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

import torch
from main_pytorch import PyTorchGradCAM
from inference import load_trained_model, predict_with_model

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(f"Loading trained PyTorch DenseNet121 model on {device}...", flush=True)
model, threshold = load_trained_model(device)
gradcam = PyTorchGradCAM(model, model.get_last_conv_layer())
print(f"PyTorch X-ray server ready on http://127.0.0.1:5001 (threshold={threshold:.3f})", flush=True)


class InferenceHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/predict":
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(content_length).decode("utf-8"))
        image_path = body.get("image_path")

        try:
            result = predict_with_model(model, gradcam, device, image_path, threshold=threshold)
            payload = json.dumps(result).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(payload)
        except ValueError as ve:
            err = json.dumps({"error": str(ve)}).encode("utf-8")
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(err)
        except Exception as exc:
            err = json.dumps({"error": str(exc)}).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(err)

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    HTTPServer(("127.0.0.1", 5001), InferenceHandler).serve_forever()
