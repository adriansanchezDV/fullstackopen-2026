require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const errorHandler = require('./middleware/errorHandler')


const Person = require('./models/person')

const app = express()

// =======================
// DATABASE
// =======================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Mongo error:', err))

// =======================
// MIDDLEWARE
// =======================
app.use(cors())
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :body'))

// =======================
// API ROUTES
// =======================

// GET all
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

// GET by id
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      person ? res.json(person) : res.status(404).end()
    })
    .catch(() => res.status(400).send({ error: 'malformatted id' }))
})

// CREATE
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(saved => res.json(saved))
    .catch(next)   // 🔥 ESTO ES CLAVE
})

// DELETE
  app.delete('/api/persons/:id', (req, res, next) => {
  console.log("DELETE BACKEND HIT:", req.params.id)

  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      console.log("DELETED:", result)
      res.status(204).end()
    })
    .catch(next)
})

// UPDATE
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const updatedPerson = {
    name,
    number
  }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, {
    returnDocument: 'after',
    runValidators: true,
    context: 'query'
  })
    .then(result => {
      res.json(result)
    })
    .catch(next)
})

//Info 
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(next)
})

// =======================
// FRONTEND (BUILD)
// =======================
app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})


// =======================
// ERROR HANDLER
// =======================
app.use(errorHandler)

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})