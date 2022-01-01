import React, { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Error from './components/Error'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      const returnedBlogs = await blogService.getAll()
      setBlogs(returnedBlogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
      if (loggedUserJSON) {
        const user = await JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      }
    }
    fetchData()
  }, [])

  //Backend doesnt use populate on post methods so username is not immediatelly visible without refreshing
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNoticeMessage(`Blog "${blogObject.title}" by "${blogObject.author}" was added`)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      showErrorMessage('Blog was not added - Please fill all fields')
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      showNoticeMessage(`User ${user.username} logged in`)
    } catch (exception) {
      showErrorMessage('Login failed - Wrong credentials')
    }
  }

  const handleLogOut = async (event) => {
    event.preventDefault()
    try {
      setUser(null)
      window.localStorage.removeItem('loggedNoteappUser')
      showNoticeMessage(`User ${user.username} logged out`)
    } catch (exception) {
      showErrorMessage('Log out failed - Please try again')
    }
  }

  const handleLikes = async id => {
    try {
      const likedBlog = await blogs.find(blog => blog.id === id)
      const likes = likedBlog.likes += 1

      const blogObject = {
        title: likedBlog.title,
        author: likedBlog.author,
        url: likedBlog.url,
        likes: likes,
        user: likedBlog.user.id
      }
      //Backend only populates user information on get method ->
      //so likedBlog is used here instead of returnedBlog
      const returnedBlog = await blogService.update(likedBlog.id, blogObject)
      setBlogs(blogs.map(blog => blog.id !== returnedBlog.id
        ? blog
        : likedBlog))
    } catch (exception) {
      showErrorMessage('Like failed - Please try again')
    }

  }

  const handleDelete = async id => {
    try {
      const blogToBeDeleted = await blogs.find(blog => blog.id === id)

      if(window.confirm(`Remove ${blogToBeDeleted.title} by ${blogToBeDeleted.author}`)) {
        await blogService.remove(blogToBeDeleted.id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        showNoticeMessage(`Blog ${blogToBeDeleted.title} was deleted`)
      }
    } catch (exception) {
      showErrorMessage('Delete failed - Please try again')
    }

  }

  //Checking if current user and given blog match
  const checkAuthorization = blog => {
    if (blog.user.username === user.username) {
      return true
    } else {
      return false
    }
  }

  const showNoticeMessage = (message) => {
    //clearing out message if previous one is still visible
    setNotificationMessage(null)
    //setting a new timed notification message
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 4000)
  }

  const showErrorMessage = (message) => {
    //clearing out message if previous one is still visible
    setErrorMessage(null)
    //setting a new timed error message
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 4000)
  }

  const blogForm = () => (
    <div>
      {user.name} logged in
      <button onClick={handleLogOut}>logout</button>
      <p></p>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      <p></p>
      {blogs
        .sort((a,b) => b.likes - a.likes)
        .map(blog =>
          <div key={blog.id}>
            <Blog
              blog={blog}
              authorization={checkAuthorization(blog)}
              handleLikes={() => handleLikes(blog.id)}
              handleDelete={() => handleDelete(blog.id)}
            />
          </div>
        )}
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage} />
      <Error message={errorMessage} />

      {user === null
        ?
        <LoginForm createLogin={handleLogin} />
        :
        blogForm()
      }

    </div>
  )
}

export default App