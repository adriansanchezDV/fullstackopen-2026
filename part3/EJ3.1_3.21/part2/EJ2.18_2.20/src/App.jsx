import { useState, useEffect } from 'react'
import services from './services/servicesCountries'
import weatherServices from './services/weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

const apiKey = import.meta.env.VITE_WEATHER_KEY

console.log('API KEY:', apiKey)

  // 🔽 cargar países
  useEffect(() => {
    services.getAll().then(data => {
      setCountries(data)
    })
  }, [])

  // 🔽 filtrar países
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  // 🔽 país a mostrar
  const countryToShow =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null)

  // 🔽 limpiar selección al escribir
  const handleSearch = (e) => {
    setSearch(e.target.value)
    setSelectedCountry(null)
    setWeather(null)
  }

  // 🔽 clima
useEffect(() => {
  if (!countryToShow) return

  const capital = Array.isArray(countryToShow.capital)
    ? countryToShow.capital[0]
    : countryToShow.capital

  console.log('Fetching weather for:', capital)

  weatherServices
    .getWeather(capital, apiKey)
    .then(data => {
      setWeather(data)
    })
    .catch(err => {
      console.log('Weather API error:', err.response?.data || err.message)
    })
}, [countryToShow])

  return (
    <div>
      <h1>Countries</h1>

      <input value={search} onChange={handleSearch} />

      {/* demasiados resultados */}
      {filteredCountries.length > 10 && (
        <p>Too many matches, be more specific</p>
      )}

      {/* lista */}
      {filteredCountries.length > 1 &&
        filteredCountries.length <= 10 && (
          <ul>
            {filteredCountries.map(country => (
              <li key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => setSelectedCountry(country)}>
                  show
                </button>
              </li>
            ))}
          </ul>
        )}

      {/* detalle país */}
      {countryToShow && (
        <div>
          <h2>{countryToShow.name.common}</h2>

          <p>Capital: {countryToShow.capital}</p>
          <p>Area: {countryToShow.area}</p>

          <h3>Languages</h3>
          <ul>
            {Object.values(countryToShow.languages || {}).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>

          <img
            src={countryToShow.flags.png}
            alt="flag"
            width="150"
          />

          {/* clima */}
          <h3>Weather in {countryToShow.capital}</h3>

          {weather && (
            <div>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Wind: {weather.wind.speed} m/s</p>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App