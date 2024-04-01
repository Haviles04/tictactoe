const errorHandler = (err, req, res, next) => {
  console.log(err);
  const statusCode = res.statusCode ?? 500;
  res.status(statusCode).json({ error: { message: err.message } });
  next();
};

module.exports = {
  errorHandler,
};
