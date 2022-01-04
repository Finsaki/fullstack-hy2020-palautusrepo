const mostLikes = require('../utils/list_helper').mostLikes
const blogs = require('../utils/blogs.json').blogs

describe('most likes', () => {
  test('by writer', () => {
    expect(mostLikes(blogs)).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    )
  })
})