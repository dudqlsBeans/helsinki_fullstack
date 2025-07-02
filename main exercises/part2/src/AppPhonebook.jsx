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

    // Add the new person only if name is not already in the list
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
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
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App