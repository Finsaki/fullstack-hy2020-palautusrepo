import React, { useState, useEffect } from 'react'
import axios from 'axios'

/*
* Aki K. 13.10.2021, updated 15.10.2021
*/

const App = () => {

  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleShowCountryClick = (country) => {
    setNewFilter(country)
  }

  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <Countries countries={countries} newFilter={newFilter} handleShowCountryClick={handleShowCountryClick} />
    </div>
  )
}

const Countries = (props) => {
  const filteredCountries = props.countries.filter(country => country.name.common.toLocaleLowerCase().includes(props.newFilter.toLocaleLowerCase()))
  if (filteredCountries.length === 1){
    return (
      <div>
        <CountrySpesific country={filteredCountries[0]} />
      </div>
    )
  } else if (filteredCountries.length <= 10) {
    return (
      <div>
          {filteredCountries.map(country => <Country key={country.cca2} country={country} handleShowCountryClick={props.handleShowCountryClick}/>)}
      </div>
    )
  } else {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
}

const Country = (props) => (
  <div>
    {props.country.name.common}
    <button onClick={() => props.handleShowCountryClick(props.country.name.common)}>show</button>
  </div>
)

//population could be found even though exercise said not
const CountrySpesific = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>population {country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
      <Languages languages={country.languages}/>
      <img src={country.flags.png} alt={country.flag} width="150" />
      <Weather capital={country.capital} />
    </div>
  )
}

const Languages = ({languages}) => {
  return (
    <div>
      <h2>languages</h2>
      <ul>
        {Object.values(languages).map(language => <Language key={language} language={language} />)}
      </ul>
    </div>
  )
}

const Language = ({language}) => {
  return (
    <li>{language}</li>
  )
}

const Filter = (props) => {
  return (
    <div>
      find countries <input value={props.newFilter} onChange={props.handleFilterChange}/>
    </div>
  )
}

const Weather = ({capital}) => {
  //Used openweathermap.org for the weather api, this is because weatherstack.com had a limit of 250 api searches per month for free version. I quickly went over the limit.
  //Making this work took way too much time, and for some reason if response.data was saved to weather, then accessing it with weather.main.temp didnt work.
  //Only solution that worked was assign the values individually inside useEffect
  //I added description because some pictures are not so clear
  //const [weather, setWeather] = useState([]) //Didnt work when accessing nested objects
  const [temperature, setTemp] = useState([])
  const [description, setDescription] = useState([])
  const [windSpeed, setWindSpeed] = useState([])
  const [iconSource, setIconSource] = useState([])
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital[0]}&units=metric&appid=${api_key}`)
      .then(response => {
        //setWeather(response.data) //Didnt work when accessing nested objects
        setTemp(response.data.main.temp)
        setDescription(response.data.weather[0].description)
        setIconSource(`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
        setWindSpeed(response.data.wind.speed)
      })
      .catch(error => console.log('Error reading weather data'))
  }, [])

  if (capital === null) {
    return (
      null
    )
  } else {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>Temperature: {temperature} C</p>
        <img src={iconSource} alt={description}/>
        <p>Description: {description}</p>
        <p>Windspeed: {windSpeed} m/s</p>
      </div>
    )
  }
}

export default App;
