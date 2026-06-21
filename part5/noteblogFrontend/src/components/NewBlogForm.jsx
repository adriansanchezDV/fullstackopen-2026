import { useState } from 'react'



const NewBlogForm = ({ addBlog }) => {
 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()

    addBlog({
      title,
      author,
      url,
    })  

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  
  return (
    <form onSubmit={createBlog}>

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