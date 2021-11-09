const morgan = require('morgan')
const logger = require('./logger')

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

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  morgan,
  unknownEndpoint,
  errorHandler
}