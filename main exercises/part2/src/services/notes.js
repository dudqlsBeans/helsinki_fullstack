import axios from 'axios'
const baseUrl = 'http://localhost:80/api/notes' 
/*
because both the frontend and the backend are at the same address, we can declare
baseUrl as a relative URL, meaning server declaration can be removed. 
*/

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

export default { getAll, create, update }