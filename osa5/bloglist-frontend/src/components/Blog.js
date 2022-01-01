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

  //Backend only populates user information on get method ->
  //so blog.user.name is not immediatelly visible without refreshing
  //I assume this wasnt part of the Part4 exercises and does not need to be fixed
  const showAllInfo = () => (
    <div>
      <div>
        {blog.url}
      </div>
      <div>
        {blog.likes}
        <button onClick={handleLikes}>like</button>
      </div>
      <div>
        {blog.user.name}
      </div>
      {authorization ? showDeleteButton() : null}
    </div>
  )

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