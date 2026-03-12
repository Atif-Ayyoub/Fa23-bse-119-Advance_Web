export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource ID' });
  }

  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue || {})[0] || 'field';
    return res.status(409).json({
      message: `Duplicate value for ${duplicateField}`,
    });
  }

  const status = error.statusCode || 500;
  res.status(status).json({
    message: error.message || 'Internal server error',
  });
};
