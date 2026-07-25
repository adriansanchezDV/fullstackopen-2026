import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './context/NotificationContext'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useUserValue, useUserDispatch } from './context/UserContext'
import UsersView from './views/UsersView'
import UserView from './views/UserView'
import BlogView from './views/BlogView'
import { Link } from 'react-router-dom'
import './styles/index.css'

const App = () => {
  const queryClient = useQueryClient()

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const newBlogFormRef = useRef()

  const notificationDispatch = useNotificationDispatch()

  const user = useUserValue()
  const userDispatch = useUserDispatch()

  // cargar usuario logueado
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'LOGIN',
        payload: user,
      })
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    console.log('NOTIFICATION:', message, type)
    notificationDispatch({
      type: 'SHOW',
      payload: {
        message,
        type,
      },
    })

    setTimeout(() => {
      notificationDispatch({
        type: 'HIDE',
      })
    }, 5000)
  }

  // LOGIN
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      blogService.setToken(user.token)
      userDispatch({
        type: 'LOGIN',
        payload: user,
      })
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
    userDispatch({
      type: 'LOGOUT',
    })
  }

  // CREAR BLOG

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      })
      newBlogFormRef.current.toggleVisibility()
    },
  })
  const addBlog = (blogObject) => {
    createBlogMutation.mutate(blogObject)
  }

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      })
    },
  })
  // LIKE
  const likeBlog = (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    updateBlogMutation.mutate({
      id: blog.id,
      updatedBlog,
    })
  }

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      })
    },
  })
  // DELETE
  const deleteBlog = (id) => {
    const blog = blogs.find((b) => b.id === id)

    const ok = window.confirm(`Delete '${blog.title}' by ${blog.author}?`)

    if (!ok) return

    deleteBlogMutation.mutate(id)
  }

  // LOGIN SCREEN
  if (user === null) {
    return (
      <div className="container">
        <h1 className="app-title">Blog App</h1>

        <Notification />

        <div className="card login-card">
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

      <Notification />

      <div className="topbar">
        <span className="user-info">{user.name} logged in</span>

        <button className="button danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="navbar">
        <Link to="/">Blogs</Link>

        <Link className="nav-link" to="/users">
          Users
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="card">
                <Togglable buttonLabel="new blog" ref={newBlogFormRef}>
                  <NewBlogForm addBlog={addBlog} />
                </Togglable>
              </div>

              <h2 className="section-title">Blogs</h2>

              <div className="blogs-list">
                {blogsToShow.map((blog) => (
                  <Blog key={blog.id} blog={blog} />
                ))}
              </div>
            </>
          }
        />

        <Route path="/users" element={<UsersView />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </div>
  )
}

export default App
