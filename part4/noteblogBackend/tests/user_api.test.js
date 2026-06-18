const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')


const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  await api.post('/api/users').send({
    username: 'root',
    name: 'Superuser',
    password: 'sekret'
  })
})

test('a valid user can be created', async () => {
const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length + 1
  )

  const usernames = usersAtEnd.map(u => u.username)

  assert.ok(usernames.includes('mluukkai'))
})

test('creation fails with proper status code if username already exists', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Another Root',
    password: 'secret123'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(result.body.error, /unique/i)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length
  )
})

test('creation fails if username is shorter than 3 characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'secret123'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(result.body.error, /username/i)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length
  )
})

test('creation fails if password is shorter than 3 characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'validuser',
    name: 'Valid User',
    password: 'ab'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(result.body.error, /password/i)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length
  )
})

test('creation fails if username is missing', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'No Username',
    password: 'secret123'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(result.body.error, /username/i)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length
  )
})

test('creation fails if password is missing', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'nouserpassword',
    name: 'No Password'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(result.body.error, /password/i)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length
  )
})

after(async () => {
  await mongoose.connection.close()
})