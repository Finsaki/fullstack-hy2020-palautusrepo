const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')

logger.info('connecting to', config.MONGODB_URI)

//Had to add some additional parameters to prevent deprecation warnings when downgrading from mongoose 6.x.x -> 5.x.x
mongoose.connect(config.MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false, useCreateIndex : true } )
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
//app.use(express.static('build')) //no frontend build in use yet --> also add .eslintignore and .gitignore for build
app.use(express.json())
app.use(middleware.morgan(':method :url :status :res[content-length] :response-time ms :response-body'))

//--------router needs to come after cors, express.json and morgan---------
//router <-> blogs(GET, POST, PUT...) <-> blog(Mongoose Schema)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

//--------unknownendpoint and errorhandler come after router, errorhandler needs to be last-------
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app