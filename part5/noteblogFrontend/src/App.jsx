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

  

  // cargar blogs
  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  // cargar usuario logueado
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

  // LOGIN
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')

      showNotification(`Welcome ${user.name}`)

    } catch (error) {
      showNotification('Wrong username or password', 'error')
    }
  }

  // LOGOUT
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  // CREAR BLOG
  const addBlog = async (blogObject) => {
  const returnedBlog = await blogService.create(blogObject)

  //  asegurar estructura consistente
  const normalizedBlog = {
    ...returnedBlog,
    user: returnedBlog.user || user
  }

  newBlogFormRef.current.toggleVisibility()

  setBlogs(blogs.concat(normalizedBlog))
}

  // LIKE
  const likeBlog = async (blog) => {

      console.log('CLICK', blog.title, blog.likes)
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
     console.log('SERVER', returnedBlog.likes)
    setBlogs(prevBlogs =>
  prevBlogs.map(b => b.id === blog.id ? returnedBlog : b)
)
  }

  // DELETE
  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)

    const ok = window.confirm(
      `Delete '${blog.title}' by ${blog.author}?`
    )

    if (!ok) return

    await blogService.remove(id)

    setBlogs(blogs.filter(b => b.id !== id))
  }

  // LOGIN SCREEN
  if (user === null) {
    return (
      <div className="container">

        <h1>Blog App</h1>

        <Notification message={message} type={messageType} />

        <div className="card">

          <h2>Log in</h2>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>

            <button type="submit">Login</button>

          </form>

        </div>
      </div>
    )
  }

  // LOGGED VIEW
  const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div className="container">

      <h1>Blog App</h1>
      

      <Notification message={message} type={messageType} />

      <div className="topbar">
        <span>{user.name} logged in</span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <Togglable buttonLabel="new blog" ref={newBlogFormRef}>
          <NewBlogForm addBlog={addBlog} />
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