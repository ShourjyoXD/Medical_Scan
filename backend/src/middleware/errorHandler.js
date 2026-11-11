const multer = require('multer');

function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds limit of 10 MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    return res.status(err.status || 400).json({
      error: err.message || 'An error occurred while processing the request.'
    });
  }

  next();
}

module.exports = errorHandler;
