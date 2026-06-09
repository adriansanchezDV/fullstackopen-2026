require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Note = require('./models/note')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


console.log("INDEX.JS IS RUNNING")

app.get('/', (request, response) => {
  response.send('<h1>Hello world !</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
     .catch(error => next(error))
    })


app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
})
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}
app.put('/api/notes/:id', (req, res, next) => {
   console.log("PUT HIT:", req.params.id)
  const { important } = req.body

  Note.findByIdAndUpdate(
    req.params.id,
    { important },
    { new: true }
  )
    .then(updatedNote => res.json(updatedNote))
    .catch(error => next(error))
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})