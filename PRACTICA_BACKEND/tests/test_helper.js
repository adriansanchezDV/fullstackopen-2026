const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: true
  },
  {
    content: 'Browser can execute only JavaScript',
    important: false
  }
]

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes,
  notesInDb
}