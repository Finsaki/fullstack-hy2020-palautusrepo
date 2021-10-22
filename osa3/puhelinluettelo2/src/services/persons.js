import axios from 'axios'
const baseUrl = '/api/persons'

const getAllPersons = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createPerson = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const updatePerson = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  //unused return, mayby useful later
  return request.then(response => response.data)
}

const returnDefaultObject = { getAllPersons, createPerson, updatePerson, deletePerson }
export default returnDefaultObject