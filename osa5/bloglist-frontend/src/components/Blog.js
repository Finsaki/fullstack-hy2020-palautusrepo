import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, authorization, handleLikes, handleDelete }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [blogInfoVisible, setBlogInfoVisible] = useState(false)

  //authorization is true if user = blog.user and also if blog has no user
  const showAllInfo = () => {
    return (
      <div>
        <div>
          {blog.url}
        </div>
        <div>
          <span id='likes'>{blog.likes}</span>
          <button onClick={handleLikes}>like</button>
        </div>
        {fixMissingUser()}
        {authorization ? showDeleteButton() : null}
      </div>
    )
  }

  //This function is used to check if blog has a valid user, if not then user is replaced with placeholder
  //This might be redundant now that the backend is fixed (user is saved properly on post)
  const fixMissingUser = () => {
    try {
      return (
        <div>
          {blog.user.name}
        </div>
      )
    } catch (exception) {
      return (
        <div>
          No user associated
        </div>
      )
    }
  }

  const showDeleteButton = () => (
    <div>
      <button onClick={handleDelete}>delete</button>
    </div>
  )

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setBlogInfoVisible(!blogInfoVisible)}>
        {blogInfoVisible ? 'hide' : 'view'}
      </button>
      {blogInfoVisible ? showAllInfo() : null}
    </div>
  )

}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  authorization: PropTypes.bool.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Blog