const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ypyo01:${password}@cluster0.ckwxqch.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

// const Note = mongoose.model('Note', noteSchema)
const Person = mongoose.model('Phonebook', personSchema)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

/*
const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/
/*
const person = new Person({
    name: "Ada Lovelace",
    number: "39-44-5323523",
})

person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
})
*/
/*
Note.find({ important: true }).then(result => {  // important: true allows the user to search only for important notes
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

*/