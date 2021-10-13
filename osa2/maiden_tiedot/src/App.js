import React, { useState, useEffect } from 'react'
import axios from 'axios'

/*
* Aki K. 13.10.2021
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

export default App;
