require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsController = require('./controllers/blogs')
const usersController = require('./controllers/users')
const middleware = require('./utils/middleware')
const loginController = require('./controllers/login')
const testingController = require('./controllers/testing')
const mongoUrl =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use(middleware.logger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsController)
app.use('/api/users', usersController)
app.use('/api/login', loginController.login)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingController)
}


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app