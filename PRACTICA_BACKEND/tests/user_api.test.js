const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')

const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root',
    passwordHash
  })

  await user.save()
})

test('a valid user can be created', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'juan',
    name: 'Juan Pérez',
    password: '123456'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
})

test('creation fails if username already exists', async () => {
  const usersAtStart = await helper.usersInDb()

  const user = {
    username: 'root',
    name: 'Superuser',
    password: '123456'
  }

  const result = await api
    .post('/api/users')
    .send(user)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)

  assert(result.body.error.includes('expected `username` to be unique'))
})

after(async () => {
  await mongoose.connection.close()
})