//allows to use app.use('/api/blogs', blogsRouter) in app.js
//This route will now always be prefixed with /api/blogs so getAll from api/blogs is just /
const blogsRouter = require('express').Router()
//getting the Mongoose Schema
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name:1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

//Old post method before making connection to users, keep here for reference
/*
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.json(savedBlog.toJSON())
})
*/

//Had to change mongoose to version 5.x.x from version 6.x.x to get this to work
//Also changed mongoose-unique-validator to version 2.x.x from 3.x.x because errors
//Now getting deprecation warnings but cant find a fix for that, everything seems to work though
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  //const user = await User.findById(body.userId)
  //temporary solution in exercise 4.17 for adding the first user in dp as the variable for blog ----> change later
  const users = await User.find({})
  const user = users[0]

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  //cannot use command new here, will create new unique id
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter