const errorHandler = (err, req, res, next) => {
  const status =
    err.statusCode ||
    (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(status).json({
    error: err.message || 'Server error',
    message: err.message || 'Server error',
  });
};

module.exports = errorHandler;
