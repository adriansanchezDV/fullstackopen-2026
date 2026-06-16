const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const app = require('../app')

const api = supertest(app)
let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    passwordHash
  })

  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  const blogObjects = helper.initialBlogs.map(b => new Blog({
    ...b,
    user: user._id
  }))

  await Promise.all(blogObjects.map(b => b.save()))
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.ok(Array.isArray(response.body))
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  assert.ok(blog.id)
  assert.strictEqual(blog._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('blog is actually saved', async () => {
  const newBlog = {
    title: 'Saved Blog',
    author: 'Tester',
    url: 'http://saved.com',
    likes: 2
  }

  await api.post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()

const titles = blogsAtEnd.map(b => b.title)

assert.ok(titles.includes('Saved Blog'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'No likes blog',
    author: 'Tester',
    url: 'http://test.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Tester',
    url: 'http://test.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Missing URL blog',
    author: 'Tester',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')

  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

assert.strictEqual(
  blogsAtEnd.length,
  helper.initialBlogs.length - 1
)
})

test('likes of a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')

  const blogToUpdate = blogsAtStart.body[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: 999
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlog)
    .expect(200)

  assert.strictEqual(response.body.likes, 999)
})


test('blog creation fails with 401 if token is missing', async () => {
  const newBlog = {
    title: 'Unauthorized blog',
    author: 'Test',
    url: 'http://test.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})