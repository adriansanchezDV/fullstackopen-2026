const Note = require('../models/note')
const User = require('../models/user')

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



const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  notesInDb,
  usersInDb
}