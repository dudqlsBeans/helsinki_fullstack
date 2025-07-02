import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // keeping track of which notes should be displayed
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    noteService
      .getAll() // initiates the fetching of data from the server as well as registers the following function as an event handler for the operation 
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }
  useEffect(hook, []) 
  /* 
  takes in two parameters. The first is a function, the effect itself. 
  The second parameter is used to specify how often the effect is run. If it is empty, then the effect is only 
  run along with the first render of the component. 
  */
  console.log('render', notes.length, 'notes')

  const toggleImportanceOf = (id) => {
    // const url = `http://localhost:3001/notes/${id}` // define unique url for each note resource based on its id 
    const note = notes.find(n => n.id === id) // find note we want to modify and then assign it to the note variable
    const changedNote = { ...note, important: !note.important } 
    /* 
    create a new object that is an exact copy of the old note, apart from the important property that has the value flipped 
    { ...note } creates a new object with copies of all the properties from the note object. When we add properties inside the curly braces after 
    the spread object, e.g. {...note, important: true}, then the value of the important property of the new object will be true.  In our case here, the value
    of the important property will be change to important for those that are not important.
    */
    /*
    axios.put(url, changedNote).then(response => {
      setNotes(notes.map(note => note.id === id ? response.data : note))
    })
    console.log('importance of ' + id + ' needs to be toggled')
    */
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {
        setErrorMessage (
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5, // notes have 50% chance of being marked as important
    }
    /*
    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        setNotes(notes.concat(response.data)) // new note is added to the list of notes using the concat array method (!not mutated, instead creates a new array)
        setNewNote('') // resetting input element
      })
    console.log('button clicked', event.target)
    */
   noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
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
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <Footer />
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
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