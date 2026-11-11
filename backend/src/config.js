const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  PYTHON_BIN: process.env.PYTHON_BIN || 'python',
  UPLOAD_DIR: path.resolve(__dirname, '../uploads'),
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],

  SCRIPTS: {
    xray: path.resolve(__dirname, '../../dl/xray/inference.py'),
    mri: path.resolve(__dirname, '../../dl/mri/inference.py')
  }
};
