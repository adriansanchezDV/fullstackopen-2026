import { useState, useEffect, useRef  } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'


const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()



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
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser',
        JSON.stringify(user)
      )



      noteService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // eslint-disable-next-line no-undef
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        console.log(exception)
        // eslint-disable-next-line no-undef
        setErrorMessage(null)
      }, 5000)
    }
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

    </div>
  )
}

export default App