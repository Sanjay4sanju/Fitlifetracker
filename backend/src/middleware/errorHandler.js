export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    return res.status(400).json({ errors });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: 'This value must be unique'
    }));
    return res.status(400).json({ errors });
  }

  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
};