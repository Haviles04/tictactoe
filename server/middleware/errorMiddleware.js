const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ?? 500;
  res.status(statusCode);
  res.render("error", { error: err });
};

module.exports = {
  errorHandler,
};
