const express = require('express')
const app = express()
const morgan = require('morgan')
morgan.token('post-data', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''  // JSON.stringify() converts a JS value to a JSON string
})


let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json()) // activate json parser
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.use(requestLogger)


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
      response.json(person)
  } else {
      response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const date = new Date()
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
    `
    response.send(info)
})


app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
/*
this will now handle all HTTP GET requests that are of the form /api/notes/something, where something is an arbitrary string
the id parameter in the route of a request can be accessed through the request object
*/

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})



const generateId = () => {
  const maxId = notes.length > 0
    /* 
    n => Number(n.id)) creates a new array that contains all the ids of the notes in number form
    Math.max returns the max value of the numbers that are passed to it
    this cannot take in an array, therefore, the array can be transformed into individual numbers with the ... three dots syntax
    */
    ? Math.max(...notes.map(n => Number(n.id))) 
    : 0
    return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  
  if (!body.content) {
    return response.status(400).json({  // w/o the return statement, the code will execute to the very end and the malformed note gets saved to the application
      error: 'content missing'
    })
  }
  const note = {
    content: body.content,
    important: body.important || null, 
    id: generateId(),
  }
  notes = notes.concat(note)

  response.json(note)
})
/*
this makes it possible to add new notes to the server
*/ 
const generateIdRandom = () => {
  const maxId = notes.length > 0
    ? Math.floor(Math.random(...notes.map(n => Number(n.id))) * 1_000_000_000)
    : 0
    return String(maxId)
}
app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({  // w/o the return statement, the code will execute to the very end and the malformed note gets saved to the application
      error: 'name or number missing'
    })
  }

  const existingPerson = persons.find(p => p.name === body.name)
  if (existingPerson) {
    return response.status(409).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateIdRandom(),
    name: body.name,
    number: body.number || false, 
  }
  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})