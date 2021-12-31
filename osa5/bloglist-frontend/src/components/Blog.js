import React, { useState } from 'react'

const Blog = ({ blog, handleLikes }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [blogInfoVisible, setBlogInfoVisible] = useState(false)
  

const showAllInfo = () => (
  <div>
    <div>
      {blog.url}
    </div>
    <div>
      {blog.likes}
      <button onClick={handleLikes}>
        like
      </button>
    </div>
    <div>
      {blog.user.name}
    </div>
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

export default Blog