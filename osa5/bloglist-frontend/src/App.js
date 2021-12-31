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
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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
      {blogs.map(blog =>
        <div key={blog.id}>
          <Blog blog={blog} />
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