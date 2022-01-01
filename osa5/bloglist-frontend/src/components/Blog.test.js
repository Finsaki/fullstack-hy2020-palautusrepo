import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

test('renders only non-hidden content', () => {
  const blog = {
    title: 'Title for blog',
    author: 'Author Abc',
    url: 'https://www.google.fi/',
    likes: 42,
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLikes={mockHandler} authorization={true} handleDelete={mockHandler}/>
  )

  expect(component.container).toHaveTextContent(
    'Title for blog'
  )

  expect(component.container).toHaveTextContent(
    'Author Abc'
  )

  expect(component.container).not.toHaveTextContent(
    'https://www.google.fi/'
  )

  expect(component.container).not.toHaveTextContent(
    '42'
  )
})

test('renders also hidden content when button is pressed', () => {
  const blog = {
    title: 'Title for blog',
    author: 'Author Abc',
    url: 'https://www.google.fi/',
    likes: 42,
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLikes={mockHandler} authorization={true} handleDelete={mockHandler}/>
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'Title for blog'
  )

  expect(component.container).toHaveTextContent(
    'Author Abc'
  )

  expect(component.container).toHaveTextContent(
    'https://www.google.fi/'
  )

  expect(component.container).toHaveTextContent(
    '42'
  )
})

test('clicking the like button twice calls event handler also twice', async () => {
  const blog = {
    title: 'Title for blog',
    author: 'Author Abc',
    url: 'https://www.google.fi/',
    likes: 42
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLikes={mockHandler} authorization={true} handleDelete={mockHandler}/>
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)
  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})