import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // keeping track of which notes should be displayed

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes') // initiates the fetching of data from the server as well as registers the following function as an event handler for the operation 
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }

  useEffect(hook, []) 
  /* 
  takes in two parameters. The first is a function, the effect itself. 
  The second parameter is used to specify how often the effect is run. If it is empty, then the effect is only 
  run along with the first render of the component. 
  */
  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5, // notes have 50% chance of being marked as important
      id: String(notes.length + 1),
    }

    setNotes(notes.concat(noteObject)) // new note is added to the list of notes using the concat array method (!not mutated, instead creates a new array)
    setNewNote('') // resetting input element
    console.log('button clicked', event.target)
  }

  // to enable editing, we need to add an event handler that synchronizes the changes made 
  // to the input with the component's state
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
  
  const notesToShow = showAll
    ? notes
    : notes.filer(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
          <input 
          value={newNote} 
          onChange={handleNoteChange} // this is called every time a change occurs in the input element
          />
          <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App 