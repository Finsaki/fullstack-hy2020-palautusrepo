import React, { useState } from 'react'

/*
* Aki K. 15.09.2021
*/

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={good + bad + neutral}/>
    </div>
  )
}

const Statistics = ({good, neutral, bad, all}) => {

  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text='good' result={good} />
          <StatisticLine text='neutral' result={neutral} />
          <StatisticLine text='bad' result={bad} />
          <StatisticLine text='all' result={all} />
          <StatisticLine text='average' result={(good * 1 + bad * -1) / all} />
          <StatisticLine text='positive' result={good / all * 100} optText='%'/>
        </tbody>
      </table>
  </div>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, result, optText}) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{result}</td>
        <td>{optText}</td>
      </tr>
    </>
  )
}

export default App