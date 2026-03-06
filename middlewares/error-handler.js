const { SERVER_ERROR } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || SERVER_ERROR;
  const message =
    statusCode === SERVER_ERROR
      ? "An error has occurred on the server."
      : err.message || "An error has occurred on the server.";

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
