import React from 'react'

/*
* Aki K. 06.09.2021
*/

const Header = (props) => (
  <>
    <h1>{props.text}</h1>
  </>
)

const Content = (props) => (
  <>
    <Part part={props.parts[0]} />
    <Part part={props.parts[1]} />
    <Part part={props.parts[2]} />
  </>
)

const Total = (props) => (
  <>
    <p>{props.text} {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
  </>
)

const Part = (props) => (
  <>
    <p>{props.part.name} {props.part.exercises}</p>
  </>
)

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
      <Total text='Number of exercises ' parts={course.parts} />
    </div>
  )
}

export default App;
