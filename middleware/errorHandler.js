function errorHandler(err, req, res, next) {
  const errStatus = err.statusCode || 500;
  const errMessage = err.message || "Something Went Wrong";
  res.status(200).json({ message: errMessage, status: errStatus });
}

module.exports = errorHandler;
