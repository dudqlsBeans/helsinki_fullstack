import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' },
    { name: 'Ada Lovelace' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = { name: newName}

    // Add the new person only if name is not already in the list
    if (persons.some(person => person.name === newName)) {
      alert('${newName} is already added to phonebook')
      return
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
  }

  const handleChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <div>debug: {newName}</div>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person, index) => (
          <li key={index}>{person.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App