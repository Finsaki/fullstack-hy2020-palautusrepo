const mostBlogs = require('../utils/list_helper').mostBlogs
const blogs = require('../utils/blogs.json').blogs

describe('most blogs', () => {
  test('by writer', () => {
    expect(mostBlogs(blogs)).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })
})