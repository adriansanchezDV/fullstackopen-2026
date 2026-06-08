import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = (city, apiKey) => {
  const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`
  return axios.get(url).then(res => res.data)
}

export default { getWeather }