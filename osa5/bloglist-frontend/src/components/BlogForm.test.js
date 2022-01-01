import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog function by submit and with proper information', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('#form')

  fireEvent.change(title, {
    target: { value: 'Title for blog' }
  })
  fireEvent.change(author, {
    target: { value: 'Author Abc' }
  })
  fireEvent.change(url, {
    target: { value: 'https://www.google.fi/' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Title for blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Author Abc')
  expect(createBlog.mock.calls[0][0].url).toBe('https://www.google.fi/')
})

