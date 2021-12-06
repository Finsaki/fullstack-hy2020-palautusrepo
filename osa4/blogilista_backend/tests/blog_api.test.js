const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await helper.blogsInDb()
  expect(response).toHaveLength(helper.initialBlogs.length)
})

test('blogs have identifier id', async () => {
  const response = await helper.blogsInDb()
  for (let blog of response) {
    expect(blog).toHaveProperty('id')
  }
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'How to Create React App in 5 Minutes?',
    author: 'Anna Danilec',
    url: 'https://www.blog.duomly.com/how-to-create-react-app-in-5-minutes/',
    likes: 6
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'How to Create React App in 5 Minutes?'
  )
})

test('a blog with no likes can be added and likes are set to 0', async () => {
  const newBlog = {
    title: 'How to Create React App in 1 Minute?',
    author: 'Danna Anilec',
    url: 'https://www.blog.duomly.com/'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const titlesAndLikes = blogsAtEnd.map(n => {
    const container = {}
    container.title = n.title
    container.likes = n.likes
    return container
  })
  expect(titlesAndLikes).toContainEqual(
    { title: 'How to Create React App in 1 Minute?', likes: 0 }
  )
})

test('a blog with no title and no url can not be added', async () => {
  const newBlog = {
    author: 'Danna Anilec',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})