import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterTerm, setFilterTerm] = useState('')

  const hook = () => {
    console.log('effect')
    personService
      .getAll() // initiates the fetching of data from the server as well as registers the following function as an event handler for the operation 
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }

  useEffect(hook, [])
  console.log('render', persons.length, 'Persons')

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = {...existingPerson, number: newNumber}
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => (p.id !== existingPerson.id ? p : returnedPerson)))
            setNewName('')
            setNewNumber('')
    })
    .catch(error => {
      alert(`The information for ${newName} could not be updated.`)
    })
  }
  return
  }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
} 

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterTerm.toLowerCase())
  )

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          alert(`Information of ${name} has already been deleted from the server`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterTerm={filterTerm} handleFilterChange={e => setFilterTerm(e.target.value)} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleChangeName={e => setNewName(e.target.value)}
        handleChangeNumber={e => setNewNumber(e.target.value)}
        handleSubmit={handleSubmit}
      />
      <div>debug: {newName}</div>
      <div>debug: {newNumber}</div>
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App