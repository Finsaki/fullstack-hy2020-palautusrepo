const middleware = require('../utils/middleware')
//allows to use app.use('/api/blogs', blogsRouter) in app.js
//This route will now always be prefixed with /api/blogs so getAll from api/blogs is just /
const blogsRouter = require('express').Router()
//getting the Mongoose Schema
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name:1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

//Had to change mongoose to version 5.x.x from version 6.x.x to get this to work
//Also changed mongoose-unique-validator to version 2.x.x from 3.x.x because errors
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  //with middleware
  const user = request.user

  //03.01.2022 fixed problem with backend, was saving user: user._id instead of just user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  //with middleware
  const user = request.user
  //checking if tokenid and blog's userid match
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }

  return response.status(401).json({ error: 'delete unauthorized for user' })
})

blogsRouter.put('/:id', async (request, response) => {
  //cannot use command new here, will create new unique id
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter