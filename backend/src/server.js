const express = require('express');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', apiRoutes);
app.use(errorHandler);

const HOST = '0.0.0.0';
const PORT = config.PORT || 5000;

app.listen(PORT, HOST, () => {
  console.log(`Backend server running at http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
  console.log(`- Health Check: http://127.0.0.1:${PORT}/health`);
  console.log(`- Models API: http://127.0.0.1:${PORT}/api/v1/models`);
  console.log(`- Analyze API: http://127.0.0.1:${PORT}/api/v1/analyze`);
});
