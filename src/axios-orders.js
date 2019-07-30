import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://burger-builder-e640e.firebaseio.com/'
})

export default instance