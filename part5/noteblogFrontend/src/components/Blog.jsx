const Blog = ({ blog }) => {
  return (
    <div className="blog">

      <h3>{blog.title}</h3>

      <p>{blog.author}</p>

      <small>{blog.url}</small>

    </div>
  )
}

export default Blog