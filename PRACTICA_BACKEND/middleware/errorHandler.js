const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  // ID mal formado
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  // VALIDACIONES MONGOOSE
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = errorHandler