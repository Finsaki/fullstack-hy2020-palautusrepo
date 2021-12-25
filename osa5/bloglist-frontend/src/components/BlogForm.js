import React, { useState } from 'react'

const BlogForm = ({createBlog}) => {
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
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={newBlogTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            value={newBlogAuthor}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            value={newBlogURL}
            onChange={handleURLChange}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
  
}

export default BlogForm