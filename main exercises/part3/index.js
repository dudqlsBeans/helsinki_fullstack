require('dotenv').config() // dotenv should get imported before the note model is imported. This ensures that the env var from the .env file are available globally before the code from the other modules is imported
const express = require('express')
const Note = require('./models/note')
const Person = require('./models/person')

const app = express()

const morgan = require('morgan')
morgan.token('post-data', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''  // JSON.stringify() converts a JS value to a JSON string
})

const cors = require('cors')
app.use(cors())

let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(express.static('dist'))
app.use(express.json()) // activate json parser
app.use(requestLogger)
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))



app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      response.send(`
        <p>Phonebook has info for ${Person.length} people</p>
        <p>${date}</p>    
      `)
    })
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({  // w/o the return statement, the code will execute to the very end and the malformed note gets saved to the application
      error: 'content missing'
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    id: generateId(),
  })
  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})


app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
/*
this will now handle all HTTP GET requests that are of the form /api/notes/something, where something is an arbitrary string
the id parameter in the route of a request can be accessed through the request object
*/




app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id) // fetch note to be updated
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const updatedPerson = { name, number }

  Person.findByIdAndUpdate(
    request.params.id,
    updatedPerson,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedDoc => {
      if (updatedDoc) {
        response.json(updatedDoc)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


const generateIdRandom = () => {
  const maxId = notes.length > 0
    ? Math.floor(Math.random(...notes.map(n => Number(n.id))) * 1_000_000_000)
    : 0
  return String(maxId)
}
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({  // w/o the return statement, the code will execute to the very end and the malformed note gets saved to the application
      error: 'name or number missing'
    })
  }
  Person.findOne({ name: name })
    .then(existingPerson => {
      if (existingPerson) {
        existingPerson.number = number
        existingPerson.save()
          .then(updatedPerson => {
            response.json(updatedPerson)
          })
          .catch(error => next(error))
      } else {
        const person = new Person({ name, number })
        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
      }
    })
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

app.use(express.static('dist'))
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)



const PORT = process.env.PORT || 80
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${HOST}:${PORT}`)
})