const { test,describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})


describe('total likes', () => {

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com',
      likes: 5
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    assert.strictEqual(result, 5)
  })

  describe('favorite blog', () => {

  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'url1',
      likes: 3
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      url: 'url2',
      likes: 10
    },
    {
      title: 'Blog 3',
      author: 'Author 3',
      url: 'url3',
      likes: 5
    }
  ]

  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      title: 'Blog 2',
      author: 'Author 2',
      likes: 10
    })
  })
})


describe('most blogs', () => {

  const blogs = [
    { author: 'Ana', title: '1' },
    { author: 'Ana', title: '2' },
    { author: 'Luis', title: '3' },
    { author: 'Ana', title: '4' },
    { author: 'Luis', title: '5' }
  ]

  test('author with most blogs is returned', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Ana',
      blogs: 3
    })
  })
})

describe('most likes', () => {

  const blogs = [
    { author: 'Ana', likes: 5 },
    { author: 'Ana', likes: 3 },
    { author: 'Luis', likes: 10 },
    { author: 'Ana', likes: 2 },
    { author: 'Luis', likes: 4 }
  ]

  test('author with most likes is returned', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Luis',
      likes: 14
    })
  })
})

})