const jwt = require('jsonwebtoken')
const User = require('../models/user')

const logger = (request, response, next) => {
  console.log('---')
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')

  next()
}

// Middleware para rutas inexistentes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

// Middleware de errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // Error de Mongo: ID mal formado
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

    if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({
      error: 'username must be unique'
    })
   
  if (error.name === 'JsonWebTokenError') {
  return response.status(401).json({
    error: 'token invalid'
  })

  }
}

  next(error)
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'token missing' })
  }

  const token = authorization.replace('Bearer ', '')

  let decodedToken

  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({ error: 'user not found' })
  }

  request.user = user

  next()
}

module.exports = {
  logger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}

