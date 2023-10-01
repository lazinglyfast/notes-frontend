import axios from "axios"

let baseUrl = "http://localhost:3002/api/notes"
if (process.env.NODE_ENV == "production") {
  baseUrl = "/api/notes"
}

let token = null
const setToken = newToken => {
  token = newToken
}

const list = () => {
  const ghost = {
    id: 10000,
    content: "This note is not saved to server",
    important: true,
  }
  return axios
    .get(baseUrl)
    .then(response => response.data.concat(ghost))
}

const create = async (note) => {
  const config = {
    headers: {
      authorization: token,
    }
  }
  const response = await axios.post(baseUrl, note, config)
  return response.data
}

const update = note => {
  return axios
    .put(`${baseUrl}/${note.id}`, note)
    .then(response => response.data)
}

export default { list, create, update, setToken }
