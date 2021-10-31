import React, { useState, useEffect } from 'react'
import personService from './services/persons'

/*
* Aki K. 23.09.2021, updated 31.10.2021
*/

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
    //could also check if the given newName is empty, but mayby it can be allowed
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
      .then((result) => showNoticeMessage(`'${personObject.name}' was added`))
      //Lets put a catch here as well if adding does not work
      //Though two different browsers can still add the same name if browser is not refreshed, should that be fixed?
      .catch(error => {
        showErrorMessage(`Adding '${personObject.name}' failed. Reason: ${error.response.data.error}`)
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
      //This needs a arrow function to work...otherwise both the success and failure are printed incase of error. I wonder why?
      .then((result) => showNoticeMessage(`'${changedPersonObject.name}' was edited`))
      .catch(error => {
        //I wonder if the info that was already removed in the server should now also be removed from their local view, or could just ask user to refresh browser?
        //This can be an error that the person was already removed, or user tried to replace existing person with too short name or number
        showErrorMessage(`Editing '${changedPersonObject.name}' failed. Reason: ${error.response.data.error}`)
      })
  }

  const showNoticeMessage = (message) => {
    //clearing out message if previous one is still visible
    setNotificationMessage(null)
    //setting a new timed notification message
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 4000)
  }

  const showErrorMessage = (message) => {
    //clearing out message if previous one is still visible
    setErrorMessage(null)
    //setting a new timed error message
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 4000)
  }

  const handlePersonDelete = (id) => {
    const personToBeDeleted = persons.find(person => person.id === id)
    if (window.confirm(`Delete person ${personToBeDeleted.name}?`)) {
      personService
        .deletePerson(id)
        //These then functions needs a arrow function to work...otherwise both the success and failure are printed incase of error. I wonder why?
        .then((result) => setPersons(persons.filter(person => person.id !== id)))
        .then((result) => showNoticeMessage(`'${personToBeDeleted.name}' was deleted`))
        .catch(error => {
          //I wonder if the info that was already removed in the server should now also be removed from their local view, or could just ask user to refresh browser?
          showErrorMessage(`Deleting '${personToBeDeleted.name}' failed. Reason: already removed from the server`)
        })
    } else {
      console.log('Phonebook person delete was cancelled')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
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
  //if I dont use arrow function for handlePersonDelete in here then the app will get stuck. But why is that? Mayby because im setting it up with a parameter here...
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

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Error = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default App
