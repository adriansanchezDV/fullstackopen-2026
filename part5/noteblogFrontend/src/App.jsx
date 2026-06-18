import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')

      showNotification(`Welcome ${user.name}`)
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const blogObject = {
        title,
        author,
        url,
      }

      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      setTitle('')
      setAuthor('')
      setUrl('')

      showNotification(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
      )
    } catch (exception) {
      showNotification('Error creating blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div className="container">

        <h1>Blog App</h1>

        <Notification
          message={message}
          type={messageType}
        />

        <div className="card">

          <h2>Log in</h2>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Username</label>

              <input
                value={username}
                onChange={({ target }) =>
                  setUsername(target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={({ target }) =>
                  setPassword(target.value)
                }
              />
            </div>

            <button>Login</button>

          </form>

        </div>

      </div>
    )
  }

  return (
    <div className="container">

      <h1>Blog App</h1>

      <Notification
        message={message}
        type={messageType}
      />

      <div className="topbar">
        <span>{user.name} logged in</span>

        <button
          className="logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="card">

        <h2>Create new blog</h2>

        <NewBlogForm
          addBlog={addBlog}
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          url={url}
          setUrl={setUrl}
        />

      </div>

      <h2>Blogs</h2>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}

    </div>
  )
}

export default App