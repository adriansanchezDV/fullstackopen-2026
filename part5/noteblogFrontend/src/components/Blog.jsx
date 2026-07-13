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
      <div style={hideWhenVisible} className="blog-summary">
        <span className="blog-title">{blog.title}</span>{' '}
        <span className="blog-author">{blog.author}</span>
        <button onClick={toggleVisibility}>view</button>
      </div>

      {/* Vista detallada */}
      <div style={showWhenVisible} className="blog-details">

        <div>
          <span className="blog-title">{blog.title}</span>{' '}
          <span className="blog-author">{blog.author}</span>
          <button onClick={toggleVisibility}>hide</button>
        </div>

        <div className="blog-url">{blog.url}</div>

        <div className="blog-likes">
          likes {blog.likes}
        </div>

        <div className="blog-user">
          {blog.user?.name}
        </div>

        <button onClick={() => likeBlog(blog)}>like</button>

        {blog.user?.username === user.username && (
          <button onClick={() => deleteBlog(blog.id)}>
            delete
          </button>
        )}

      </div>

    </div>
  )
}

export default Blog