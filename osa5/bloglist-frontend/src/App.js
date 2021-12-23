import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogURL, setNewBlogURL] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogURL
    }
    
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogURL('')
      showNoticeMessage(`Blog "${blogObject.title}" by "${blogObject.author}" was added`)
    } catch (exception) {
      showErrorMessage('Blog was not added - Please fill all fields')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleURLChange = (event) => {
    setNewBlogURL(event.target.value)
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

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage} />
      <Error message={errorMessage} />

      {user === null
        ?
        <Login handleLogin={handleLogin} username={username} handleUsernameChange={handleUsernameChange}
        password={password} handlePasswordChange={handlePasswordChange}/>
        :
        <Blogs user={user} handleLogOut={handleLogOut} blogs={blogs} addBlog={addBlog}
        title={newBlogTitle} author={newBlogAuthor} url={newBlogURL}
        handleTitleChange={handleTitleChange} handleAuthorChange={handleAuthorChange} handleURLChange={handleURLChange}/>
      }

    </div>
  )
}

const Login = (props) => {
  return (
    <div>
      <form onSubmit={props.handleLogin}>
        <div>
          username
            <input
            type="text"
            value={props.username}
            name="Username"
            onChange={props.handleUsernameChange}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={props.password}
            name="Password"
            onChange={props.handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const Blogs = (props) => {
  return (
    <div>
      {props.user.name} logged in
      <button onClick={props.handleLogOut}>logout</button>
      <p></p>
      <form onSubmit={props.addBlog}>
        <div>
          title:
          <input
            value={props.title}
            onChange={props.handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            value={props.author}
            onChange={props.handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            value={props.url}
            onChange={props.handleURLChange}
          />
        </div>
        <button type="submit">save</button>
      </form>
      <p></p>
      {props.blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App