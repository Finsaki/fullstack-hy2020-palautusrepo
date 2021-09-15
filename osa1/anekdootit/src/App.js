import React, { useState } from 'react'

/*
* Aki K. 15.09.2021
*/

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const changeAnecdote = () => setSelected(Math.floor(Math.random() * anecdotes.length))
  const changeVotes = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  let getAnecdote = anecdotes[selected]
  let getVotesCount = votes[selected]
  let getMostVotesCount = Math.max(...votes)
  let getMostVoted = anecdotes[votes.indexOf(getMostVotesCount)]

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {getAnecdote}
      <VoteCount votes={getVotesCount} />
      <Button handleClick={changeVotes} text='vote' />
      <Button handleClick={changeAnecdote} text='next anecdote' />
      <h1>Anecdote with the most votes</h1>
      {getMostVoted}
      <VoteCount votes={getMostVotesCount} />
    </div>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const VoteCount = ({votes}) => (
  <p>has {votes} votes</p>
)

export default App
