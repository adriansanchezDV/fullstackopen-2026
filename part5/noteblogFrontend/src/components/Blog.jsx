import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className="blog">

      {/* Vista compacta */}
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>

      {/* Vista detallada */}
      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </div>

        <div>{blog.url}</div>
        <div>likes {blog.likes}</div>
        <div>{blog.user?.name}</div>
        <button onClick={() => likeBlog(blog)}>like</button>

        {blog.user?.username === user.username && (
          <button onClick={() => deleteBlog(blog.id)}> delete </button>
         
 
)}
  

      </div>

    </div>
  )
}

export default Blog