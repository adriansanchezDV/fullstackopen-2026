
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/PersonService'
import Notification from './components/Notification'
import './index.css'


const App = () => {
  // STATES
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  // EFFECTS
  useEffect(() => {
  personService
    .getAll()
    .then(initialPersons => {
      console.log(initialPersons)
      setPersons(Array.isArray(initialPersons) ? initialPersons : [])
    })
}, [])

  // HANDLERS
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // CRUD FUNCTIONS
  const addPerson = (event) => {
  event.preventDefault()

  if (persons.some(person => person.name === newName)) {
    if (
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      const person = persons.find(p => p.name === newName)
      updateNumber(person.id, newNumber)
      setNewName('')
      setNewNumber('')
    }
    return
  }

  const personObject = {
    name: newName,
    number: newNumber
  }

  personService
    .create(personObject)
    .then(createdPerson => {
      setPersons(persons.concat(createdPerson))
      setNewName('')
      setNewNumber('')

      setMessageType('success')
      setMessage(`Added ${createdPerson.name}`)

      setTimeout(() => setMessage(null), 5000)
    })
    .catch(error => {
      const errorMessage =
        error.response?.data?.error || 'Something went wrong'

      setMessageType('error')
      setMessage(errorMessage)

      setTimeout(() => setMessage(null), 5000)
    })
}

  const deletePerson = (id) => {
    console.log("DELETE PERSON WITH ID:", id)
    console.log("API URL:", import.meta.env.VITE_API_URL)
  const person = persons.find(p => p.id === id)

  if (!person) return   // 💥 esto arregla el crash

  if (window.confirm(`Delete ${person.name}?`)) {
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }
}

  const updateNumber = (id, newNumber) => {
    const person = persons.find(p => p.id === id)
    
    
    const changedPerson = {
      ...person,
      number: newNumber
    }

    personService
      .update(id, changedPerson)
      .then(returnedPerson => {
        setPersons(
          persons.map(p =>
            p.id !== id ? p : returnedPerson
          )
        )
        setMessageType('success')
        setMessage(`Changed number of ${returnedPerson.name}`)

        setTimeout(() => {
        setMessage(null)
          }, 5000)
      }).catch(error => {
  console.log(error.response.data.error)

  setMessageType('error')
  setMessage(error.response.data.error || `Validation error`)

  setTimeout(() => setMessage(null), 5000)

  setPersons(persons.filter(p => p.id !== id))
})
  }

  // DERIVED VALUES
  const personsToShow = (persons ?? []).filter(person =>
  person.name.toLowerCase().includes(filter.toLowerCase())
)

  // RENDER
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} messageType={messageType} />

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h1>add a new</h1>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        personsToShow={personsToShow}
        deletePerson={deletePerson}
        updateNumber={updateNumber}
      />
    </div>
  )
}

export default App

