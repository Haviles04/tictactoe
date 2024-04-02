const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ?? 500;
  res.status(statusCode).json({ error: { message: err.message } });
  next();
};

module.exports = {
  errorHandler,
};
