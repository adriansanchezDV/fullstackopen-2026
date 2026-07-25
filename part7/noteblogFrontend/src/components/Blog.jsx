import { Link } from 'react-router-dom'
import '../styles/layout.css'

const Blog = ({ blog }) => {
  return (
    <div className="blog-card">
      <Link className="blog-title" to={`/blogs/${blog.id}`}>
        {blog.title}
      </Link>

      <span className="blog-author">{blog.author}</span>
    </div>
  )
}

export default Blog
