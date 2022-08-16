import Axios from 'axios'

const axios = Axios.create({
  baseURL:
    'https://www.fastmock.site/mock/eb7f9e535c90fdde70880b7e088fca31/api',
  timeout: 10000,
  headers: { 'Cache-Control': 'no-cache' },
})

axios.interceptors.request.use(
  (config) => {
    // console.log('axios.interceptors.request config ', config)
    return config
  },
  (error) => {
    // console.log('axios.interceptors.request error ', error)
    return error
  }
)

axios.interceptors.response.use(
  (config) => {
    // console.log('axios.interceptors.response config ', config)
    return config
  },
  (error) => {
    // console.log('axios.interceptors.response error ', error)
    return error
  }
)

export default axios
