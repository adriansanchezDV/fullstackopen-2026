import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const newBlogFormRef = useRef()
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
    // eslint-disable-next-line no-unused-vars
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
  try {
    const returnedBlog = await blogService.create(blogObject)

    setBlogs(blogs.concat(returnedBlog))

    newBlogFormRef.current.toggleVisibility()

    showNotification(
      `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
    )
  // eslint-disable-next-line no-unused-vars
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

  const likeBlog = async (blog) => {
  const updatedBlog = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id, 
  }

  const returnedBlog = await blogService.update(blog.id, updatedBlog)

   setBlogs(prev =>
    prev.map(b => b.id === blog.id ? returnedBlog : b)
  )
}

const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)

const deleteBlog = async (id) => {
  const blog = blogs.find(b => b.id === id)

  const ok = window.confirm(`Delete '${blog.title}' by ${blog.author}?`)
  if (!ok) return

  try {
    await blogService.remove(id)
    setBlogs(blogs.filter(b => b.id !== id))
  } catch (error) {
    showNotification('Error deleting blog', 'error')
  }
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
  <Togglable
    buttonLabel="new blog"
    ref={newBlogFormRef}
  >
    <h2>Create new blog</h2>

    <NewBlogForm
      addBlog={addBlog}
    />
  </Togglable>
</div>

      <h2>Blogs</h2>

      {blogsToShow.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      ))}

    </div>
    
  )
}

export default App