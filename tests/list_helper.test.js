const listHelper = require('../utils/list_helper')
const dummyData = require('./utils/dummy_blogs')

describe('dummy', () => {
  test('can be called', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('when list has no blogs equals zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const onlyBlog = dummyData.first()
    const result = listHelper.totalLikes([onlyBlog])
    expect(result).toBe(7)
  })

  test('when list has multiple blogs equals the sum of their likes', () => {
    const result = listHelper.totalLikes(dummyData.blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('when list has no blogs null is returned', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBeNull()
  })

  test('when list has only one blog then that blog is returned', () => {
    const result = listHelper.favoriteBlog([dummyData.first()])
    expect(result).toEqual(dummyData.first())
  })

  test('when list has multiple blogs then the most favorited blog is returned', () => {
    const result = listHelper.favoriteBlog(dummyData.blogs)
    expect(result.likes).toBe(12)
  })
})

describe('most blogs', () => {
  test('when list has no blogs null is returned', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBeNull()
  })

  test('when list has only one blog then that author is returned', () => {
    const result = listHelper.mostBlogs([dummyData.first()])
    expect(result.author).toBe('Michael Chan')
    expect(result.blogs).toBe(1)
  })

  test('when list has multiple blogs then the most blogging fellow is returned', () => {
    const result = listHelper.mostBlogs(dummyData.blogs)
    expect(result.author).toBe('Robert C. Martin')
    expect(result.blogs).toBe(3)
  })
})

describe('most likes', () => {
  test('when list has no blogs null is returned', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBeNull()
  })

  test('when list has only one blog then that author is returned', () => {
    const result = listHelper.mostLikes([dummyData.first()])
    expect(result.author).toBe('Michael Chan')
    expect(result.likes).toBe(7)
  })

  test('when list has multiple blogs then the most liked fellow is returned', () => {
    const result = listHelper.mostLikes(dummyData.blogs)
    expect(result.author).toBe('Edsger W. Dijkstra')
    expect(result.likes).toBe(17)
  })
})
