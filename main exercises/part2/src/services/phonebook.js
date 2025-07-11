// services/persons.js
import axios from 'axios'

const baseUrl = 'http://localhost:80/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(response => response.data)
}

// If you later want to add delete/update:
const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data)
}

export default { getAll, create, remove, update }
