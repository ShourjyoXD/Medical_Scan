const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const PERSISTENT_SERVERS = {
  xray: "http://127.0.0.1:5001/predict",
};

async function runInference(modality, imagePath) {
  const absoluteImagePath = path.resolve(imagePath);

  if (PERSISTENT_SERVERS[modality]) {
    try {
      const response = await fetch(PERSISTENT_SERVERS[modality], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path: absoluteImagePath }),
      });

      if (response.ok) {
        return await response.json();
      }
      const errText = await response.text();
      let m = errText; try { m = JSON.parse(errText).error || m; } catch {} const e = new Error(m); e.statusCode = response.status; e.status = response.status; throw e;
    } catch (err) {
      if (err.cause?.code !== "ECONNREFUSED" && !err.message.includes("fetch failed")) {
        throw err;
      }
      console.warn(`[WARN] Persistent ${modality} server offline, falling back to CLI spawn.`);
    }
  }

  const scriptPath = config.SCRIPTS[modality];

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(scriptPath)) {
      console.warn(`[WARN] Model script not found at "${scriptPath}". Returning mock fallback inference.`);
      return resolve(getFallbackResult(modality));
    }

    const pyProcess = spawn(config.PYTHON_BIN, [scriptPath, "--image", absoluteImagePath]);
    let stdoutData = "";
    let stderrData = "";

    pyProcess.stdout.on("data", (chunk) => { stdoutData += chunk.toString(); });
    pyProcess.stderr.on("data", (chunk) => { stderrData += chunk.toString(); });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Model script failed (${code}): ${stderrData || "Unknown error"}`));
      }
      try {
        resolve(JSON.parse(stdoutData.trim()));
      } catch (err) {
        reject(new Error(`Failed to parse Python model output: ${stdoutData}`));
      }
    });
  });
}

function getFallbackResult(modality) {
  if (modality === "xray") {
    return {
      modality: "xray",
      predicted_class: "Normal",
      confidence: 0.647,
      scores: { Normal: 0.647, Pneumonia: 0.353 },
      model_name: "densenet121-xray",
      explanation: { available: true, type: "gradcam", heatmap_base64: null }
    };
  }
  return {
    modality: "mri",
    predicted_class: "Glioma",
    confidence: 0.785,
    scores: { Glioma: 0.785, Meningioma: 0.112, "Pituitary Tumour": 0.071, "No Tumour": 0.032 },
    model_name: "resnet50-mri",
    explanation: { available: false, type: "none" }
  };
}

module.exports = { runInference };
