import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogURL, setNewBlogURL] = useState('')

  const handleTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleURLChange = (event) => {
    setNewBlogURL(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogURL
    })
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogURL('')
  }

  return (
    <div>
      <form id='form' onSubmit={addBlog}>
        <div>
          title:
          <input
            id='title'
            value={newBlogTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            id='author'
            value={newBlogAuthor}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            id='url'
            value={newBlogURL}
            onChange={handleURLChange}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )

}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm