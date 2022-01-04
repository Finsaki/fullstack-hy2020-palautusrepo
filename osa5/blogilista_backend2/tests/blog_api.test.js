const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const Blog = require('../models/blog')
const User = require('../models/user')

//used to access the token for authorization
let loggedInToken
//new array to house initialBlogs with associated user._id values
let initialBlogsWithUser

//Logging in a test user for tests and extracting the token
//Also updating the initialBlogs with userid so that authorization can be tested when deleting (and later modifying?) posts
beforeAll(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
  const res = await api
    .post('/api/login/')
    .send({
      username: 'root',
      password: 'sekret'
    })
  loggedInToken = res.body.token
  //Updating the blogs with a user id
  //initialBlogsWithUser is only used in "Testing blogs -> beforeEach", helper.initialBlogs can still be used to check length
  initialBlogsWithUser = helper.initialBlogs.map(blog => ({ user: user._id, ...blog }))
})

describe('Testing blogs', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogsWithUser)
  })

  //Get commands do not yet utilize authorization (add middleware to "blogs.js -> blogsRouter.get" if needed)
  describe('Getting blogs', () => {

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

  })

  describe('Posting blogs', () => {

    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'How to Create React App in 5 Minutes?',
        author: 'Anna Danilec',
        url: 'https://www.blog.duomly.com/how-to-create-react-app-in-5-minutes/',
        likes: 6
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${loggedInToken}` })
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
        author: 'Some Indian Guy Probably',
        url: 'https://www.youtube.com/'
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${loggedInToken}` })
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
        .set({ Authorization: `bearer ${loggedInToken}` })
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a valid blog can not be added without authorization ', async () => {
      const newBlog = {
        title: 'How to Create React App in 5 Minutes?',
        author: 'Anna Danilec',
        url: 'https://www.blog.duomly.com/how-to-create-react-app-in-5-minutes/',
        likes: 6
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a valid blog can not be added with invalid authorization ', async () => {
      const newBlog = {
        title: 'How to Create React App in 5 Minutes?',
        author: 'Anna Danilec',
        url: 'https://www.blog.duomly.com/how-to-create-react-app-in-5-minutes/',
        likes: 6
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: 'bearer invalidToken' })
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

  })

  describe('Deleting blogs', () => {

    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: `bearer ${loggedInToken}` })
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })

    test('a blog can not be deleted without authorization', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).toContain(blogToDelete.title)
    })

    test('a blog can not be deleted with invalid authorization', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: 'bearer invalidToken' })
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).toContain(blogToDelete.title)
    })

  })

  //Put commands do not yet utilize authorization (add middleware to "blogs.js -> blogsRouter.put" if needed)
  describe('Modifying blogs', () => {

    test('a blog can be modified', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToModify = blogsAtStart[0]
      blogToModify.likes = 76

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(blogToModify)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      const titlesAndLikes = blogsAtEnd.map(n => {
        const container = {}
        container.title = n.title
        container.likes = n.likes
        return container
      })
      expect(titlesAndLikes).toContainEqual(
        { title: blogToModify.title, likes: 76 }
      )
    })
  })

})

describe('Testing users', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('Posting users', () => {

    test('creation succeeds with good username and password provided', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper status and errormsg if username is already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper status and errormsg if password is too small', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'sa',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password too small')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper status and errormsg if username is too small', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('is shorter than the minimum allowed length')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper status and errormsg if username and password are missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Matti Luukkainen'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('missing')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

  })

})

afterAll(() => {
  mongoose.connection.close()
})