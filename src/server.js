require('express-async-errors');
const express = require('express');
const routes = require('./routes/index');
const AppError = require('./utils/app-error');

const app = express();
const port = 3000;

app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
