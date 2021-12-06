//allows to use app.use('/api/blogs', blogsRouter) in app.js
//This route will now always be prefixed with /api/blogs so getAll from api/blogs is just /
const blogsRouter = require('express').Router()
//getting the Mongoose Schema
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.json(savedBlog.toJSON())
})

module.exports = blogsRouter