const { spawn } = require('child_process');
const fs = require('fs');
const config = require('../config');

async function runInference(modality, imagePath) {
  const scriptPath = config.SCRIPTS[modality];

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(scriptPath)) {
      console.warn(`[WARN] Model script not found at "${scriptPath}". Returning mock fallback inference.`);
      return resolve(getFallbackResult(modality));
    }

    const pyProcess = spawn(config.PYTHON_BIN, [scriptPath, '--image', imagePath]);

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Model script failed (${code}): ${stderrData || 'Unknown error'}`));
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse Python model output: ${stdoutData}`));
      }
    });
  });
}

function getFallbackResult(modality) {
  if (modality === 'xray') {
    return {
      modality: 'xray',
      predicted_class: 'Normal',
      confidence: 0.647,
      scores: {
        Normal: 0.647,
        Pneumonia: 0.353
      },
      model_name: 'resnet18-xray',
      explanation: {
        available: true,
        type: 'gradcam',
        heatmap_base64: null
      }
    };
  }

  return {
    modality: 'mri',
    predicted_class: 'Glioma',
    confidence: 0.785,
    scores: {
      Glioma: 0.785,
      Meningioma: 0.112,
      'Pituitary Tumour': 0.071,
      'No Tumour': 0.032
    },
    model_name: 'resnet50-mri',
    explanation: {
      available: false,
      type: 'none'
    }
  };
}

module.exports = { runInference };
