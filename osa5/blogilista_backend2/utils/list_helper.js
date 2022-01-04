var _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (blogWithMostLikes, blog) => {
    return blogWithMostLikes.likes > blog.likes
      ? blogWithMostLikes
      : blog
  }
  return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
  //counting the times a spesific author is mentioned in the array (uses Lodash)
  const authors = _.countBy(blogs, 'author')
  const reducer = (curr, next) => {
    return authors[curr] > authors[next]
      ? curr
      : next
  }
  const author = Object.keys(authors).reduce(reducer, {})
  return {
    author: author,
    blogs: authors[author]
  }
}

const mostLikes = (blogs) => {
  //grouping entries under same author (uses Lodash)
  const groupedBlogs = _.groupBy(blogs, 'author')
  const groupedArray = Object.keys(groupedBlogs)
  //processing the new array with two map functions.
  //- First map function returns object with amount of likes
  //- Second map function sums up the likes under a spesific author and returns the object in a new form
  const groupedLikes = groupedArray.map((author) => {
    const groupByAuthor = groupedBlogs[author].map((resource) => {
      return { likes: resource.likes }
    })
    const likes = _.sumBy(groupByAuthor, 'likes')
    return {
      author: author,
      likes: likes
    }
  })
  //using favoriteBlog method to get entry with most likes
  return favoriteBlog(groupedLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}