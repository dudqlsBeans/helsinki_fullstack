import ReactDOM from 'react-dom/client'
import App from './AppPhonebook'
// import App from './App'
// import App from './Appnotes'
/*
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)  
})  
/* this is set here to access the result of the operation represented by the promise, and register an event handler to the promise.
 The console then prints all the essential data related to the response of an HTTP GET request, which would include the returned data,
 status code, and headers.

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
*/
/*
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]
ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
