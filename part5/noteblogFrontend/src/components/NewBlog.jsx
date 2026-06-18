const NewBlogForm = ({
  addBlog,
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setUrl,
}) => {
  return (
    <form onSubmit={addBlog}>

      <div className="form-group">
        <label>Title</label>

        <input
          value={title}
          onChange={({ target }) =>
            setTitle(target.value)
          }
        />
      </div>

      <div className="form-group">
        <label>Author</label>

        <input
          value={author}
          onChange={({ target }) =>
            setAuthor(target.value)
          }
        />
      </div>

      <div className="form-group">
        <label>Url</label>

        <input
          value={url}
          onChange={({ target }) =>
            setUrl(target.value)
          }
        />
      </div>

      <button>Create</button>

    </form>
  )
}

export default NewBlogForm