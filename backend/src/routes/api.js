const express = require('express');
const fs = require('fs');
const upload = require('../middleware/upload');
const { runInference } = require('../services/modelService');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/api/v1/models', (req, res) => {
  res.status(200).json({
    models: [
      {
        id: 'xray',
        name: 'Chest X-ray Classification',
        classes: ['Normal', 'Pneumonia'],
        gradcam_supported: true
      },
      {
        id: 'mri',
        name: 'Brain MRI Classification',
        classes: ['Glioma', 'Meningioma', 'Pituitary Tumour', 'No Tumour'],
        gradcam_supported: false
      }
    ]
  });
});

router.post('/api/v1/analyze', upload.single('file'), async (req, res) => {
  const file = req.file;
  const { modality } = req.body;

  if (!modality || !['xray', 'mri'].includes(modality.toLowerCase())) {
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return res.status(400).json({
      error: 'Invalid or missing "modality". Must be "xray" or "mri".'
    });
  }

  if (!file) {
    return res.status(400).json({
      error: 'Please upload an image file using the field "file".'
    });
  }

  try {
    const result = await runInference(modality.toLowerCase(), file.path);

    fs.unlink(file.path, (err) => {
      if (err) console.error(`Error deleting temp file ${file.path}:`, err);
    });

    return res.status(200).json(result);
  } catch (error) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    console.error('[Inference Error]:', error.message);
    return res.status(500).json({
      error: 'Image analysis failed.',
      details: error.message
    });
  }
});

module.exports = router;
