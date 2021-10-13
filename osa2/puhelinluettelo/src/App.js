import React, { useState, useEffect } from 'react'
import personService from './services/persons'

/*
* Aki K. 23.09.2021, updated 13.10.2021
*/

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  //fetching persons data with axios from persons.js module
  useEffect(() => {
    personService
      .getAllPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    //checking if person to be added already exists
    const checkDoublePerson = persons.some(person => person.name === newName)
    if (checkDoublePerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.find(person => person.name === newName)
        replacePerson(oldPerson)
      } else {
        console.log('Phonebook person edit was cancelled')
      }
    } else {
      //creating a new person
      const personObject = {name: newName, number: newNumber}
      personService
      .createPerson(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const replacePerson = (person) => {
    //keep the original but replace the number
    const changedPersonObject = {...person, number: newNumber }
    personService
      .updatePerson(person.id, changedPersonObject)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== changedPersonObject.id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const handlePersonDelete = (id) => {
    const personToBeDeleted = persons.find(person => person.id === id)
    if (window.confirm(`Delete person ${personToBeDeleted.name}?`)) {
      personService
        .deletePerson(id)
        .then(setPersons(persons.filter(person => person.id !== id)))
    } else {
      console.log('Phonebook person delete was cancelled')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} handlePersonDelete={handlePersonDelete} />
    </div>
  )
}

const Persons = (props) => {
  const filteredPhonebook = props.persons.filter(person => person.name.toLocaleLowerCase().includes(props.newFilter.toLocaleLowerCase()))
  return (
    <div>
        {filteredPhonebook.map(person => <Person key={person.id} person={person} handlePersonDelete={() => props.handlePersonDelete(person.id)}/>)}
    </div>
  )
}

const Person = ({person, handlePersonDelete}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={handlePersonDelete}>delete</button>
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.newFilter} onChange={props.handleFilterChange}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addPerson}>
        <div>name: <input value={props.newName} onChange={props.handleNameChange}/> </div>
        <div>number: <input value={props.newNumber} onChange={props.handleNumberChange}/> </div>
        <div><button type="submit">add</button></div>
      </form>
    </div>
  )
}

export default App
