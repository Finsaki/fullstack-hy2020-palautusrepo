import React from 'react'

const Course = ({course}) => {
    return (
        <div>
            <Header text={course.name} />
            <Content parts={course.parts} />
            <Total text='Number of total exercises ' parts={course.parts} />
        </div>
    )
}

const Header = (props) => (
    <>
      <h1>{props.text}</h1>
    </>
  )
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => <Part key={part.id} part={part} />)}
      </div>
    )
    
  }
  
  const Total = (props) => {
    return (
      <div>
        <p>{props.text} {props.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>
      </div>
    )
  }
  
  const Part = (props) => (
    <>
      <p>{props.part.name} {props.part.exercises}</p>
    </>
  )

export default Course