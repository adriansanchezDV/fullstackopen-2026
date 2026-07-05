import { useState, useEffect, useRef  } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success') 



  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      console.log('initialNotes:', initialNotes)
      console.log('isArray:', Array.isArray(initialNotes))

      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON =
    window.localStorage.getItem(
      'loggedNoteappUser'
    )

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)

      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {



    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote))
        noteFormRef.current.toggleVisibility()
      })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch (() => {
        alert(`the note '${note.content}' was already deleted from server`)
        setNotes(notes.filter((n) => n.id !== id))
      })
  }



  const notesToShow = showAll ? notes : notes.filter((note) => note.important)



  const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username,
      password,
    })

    window.localStorage.setItem(
      'loggedNoteappUser',
      JSON.stringify(user)
    )

    noteService.setToken(user.token)

    setUser(user)
    setUsername('')
    setPassword('')

    setMessage('Has iniciado sesión')
    setMessageType('success')

    setTimeout(() => setMessage(null), 5000)

  } catch (exception) {
    setMessage('wrong credentials')
    setMessageType('error')

    setTimeout(() => setMessage(null), 5000)
  }
}

  const handleLogout = () => {
  window.localStorage.removeItem('loggedNoteappUser')
  noteService.setToken(null)
  setUser(null)

  
  setMessage('Has cerrado sesión')
  setMessageType('success')

  setTimeout(() => setMessage(null), 5000)
}
  const loginForm = () => (
    <Togglable buttonLabel="log in">
     

      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) =>
          setUsername(target.value)
        }
        handlePasswordChange={({ target }) =>
          setPassword(target.value)
        }
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const noteForm = () => (
    <Togglable buttonLabel="new note"  ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )


  return (
    <div>
      <h1>Notes</h1>

       <Notification
          message={message}
          type={messageType}
        />

      {user === null
        ? loginForm()
        : (
          <div>
            <p>{user.name} logged-in</p>
            {noteForm()}
          </div>
        )
      }

      <h2>Notes</h2>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>


      <button onClick={handleLogout}>Log out</button>

    </div>
  )
}

export default App