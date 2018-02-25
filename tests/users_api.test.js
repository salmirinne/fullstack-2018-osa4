const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./utils/test_helper')

describe('when there is initially one user saved', async () => {

  beforeEach(async () => {
    await User.remove({})

    const userObjects = helper.initialUsers.map(u => new User(u))
    await Promise.all(userObjects.map(u => u.save()))
  })

  test('all users are returned as json by GET /api/users', async () => {
    const usersInDatabase = await helper.usersInDb()

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(usersInDatabase.length)

    const returnedContents = response.body.map(u => u.username)
    usersInDatabase.forEach(user => {
      expect(returnedContents).toContain(user.username)
    })
  })

  describe('addition of a new user', async () => {

    test('POST /api/users succeeds with valid data', async () => {
      const initialUsers = await helper.usersInDb()

      const newUser = {
        name: 'king',
        username: 'usertester',
        password: 'secret'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfterPost = await helper.usersInDb()

      expect(usersAfterPost.length).toBe(initialUsers.length + 1)
      const addedUser = usersAfterPost.find(u => u.username === newUser.username)
      expect(addedUser).toBeDefined()
    })

    test('POST /api/users fails when given username already exists', async () => {
      const initialUsers = await helper.usersInDb()

      const newUser = {
        name: 'king',
        username: 'test',
        password: 'secret',
        adult: false
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAfterPost = await helper.usersInDb()
      expect(usersAfterPost.length).toBe(initialUsers.length)
    })

    test('POST /api/users fails when given password is too short', async () => {
      const initialUsers = await helper.usersInDb()

      const newUser = {
        name: 'king',
        username: 'usertester',
        password: 'aa',
        adult: true
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAfterPost = await helper.usersInDb()
      expect(usersAfterPost.length).toBe(initialUsers.length)
    })
  })

  afterAll(() => {
    server.close()
  })
})