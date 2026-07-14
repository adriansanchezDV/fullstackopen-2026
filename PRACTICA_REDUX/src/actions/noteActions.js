/*
ANTES DE TOOLKIT CON REDUX CLASICO SEPARAR ACTIONS Y REDUCERS
const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}

export { createNote, toggleImportanceOf } */