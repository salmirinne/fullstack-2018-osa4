const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs')
  response.json(users.map(User.format))
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    response.status(400).send({error: 'malformatted id'})
  }
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const existingUser = await User.find({username: body.username})
  if (existingUser.length > 0) {
    return response.status(400).json({error: 'username must be unique'})
  }
  if (body.password.length < 3) {
    return response.status(400).json({error: 'password minimum length is 3'})
  }

  const passwordHash = await bcrypt.hash(body.password, 10)

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash: passwordHash,
    adult: body.adult
  })

  const error = user.validateSync()
  if (error) {
    return response.status(400).send({error: error.message})
  }

  const savedUser = await user.save()
  response.json(User.format(savedUser))
})

module.exports = usersRouter