//allows to use app.use('/api/blogs', blogsRouter) in app.js
//This route will now always be prefixed with /api/blogs so getAll from api/blogs is just /
const blogsRouter = require('express').Router()
//getting the Mongoose Schema
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter