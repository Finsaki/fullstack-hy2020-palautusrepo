import React, { useState } from 'react'

/*
* Aki K. 23.09.2021
*/

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '0401234567'},
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const checkDoublePerson = persons.some(person => person.name === newName)
    if (checkDoublePerson) {
      alert(`${newName} is allready added to phonebook`)   
    } else {
      const personObject = {name: newName, number: newNumber}
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
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

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} />
    </div>
  )
}

const Persons = (props) => {
  const filteredPhonebook = props.persons.filter(person => person.name.toLocaleLowerCase().includes(props.newFilter.toLocaleLowerCase()))
  return (
    <div>
        {filteredPhonebook.map(person => <Person key={person.name} person={person} />)}
    </div>
  )
}

const Person = ({person}) => (
  <div>
    {person.name} {person.number}
  </div>
)


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
