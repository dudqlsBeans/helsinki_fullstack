import { useState } from 'react'
import Note from './components/Note'


const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  const [showAll, setShowAll] = useState(true) // keeping track of which notes should be displayed

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