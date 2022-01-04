const totalLikes = require('../utils/list_helper').totalLikes
const blogs = require('../utils/blogs.json').blogs

const emptyList = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes(emptyList)).toBe(0)
  })

  test('when list has only one blog, its likes equal that', () => {
    expect(totalLikes(listWithOneBlog)).toBe(5)
  })

  test('of a bigger list is correct', () => {
    expect(totalLikes(blogs)).toBe(36)
  })
})