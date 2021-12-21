const morgan = require('morgan')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// custom morgan token
// eslint-disable-next-line no-unused-vars
morgan.token('response-body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return null
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//This adds the token as a new field to a request for easy access from anywhere in the app
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

//This adds the user as a new field to a request for easy access from anywhere in the app
const userExtractor = async (request, response, next) => {
  //checking that token field in request matches decodedToken with envSecret value
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  request.user = user
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })

  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })

  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  morgan,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler
}