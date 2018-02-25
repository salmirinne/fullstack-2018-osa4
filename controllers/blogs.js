const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    response.status(400).send({error: 'malformatted id'})
  }
})

blogsRouter.post('/', async (request, response) => {

  let decodedToken
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (e) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })
  const error = blog.validateSync()
  if (error) {
    return response.status(400).send({error: error.message})
  }

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

  let decodedToken
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (e) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  try {
    const blog = await Blog.findById(request.params.id)
    if (blog && blog.user.toString() !== decodedToken.id) {
      return response.status(401).json({error: 'unauthorized'})
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    response.status(400).send({error: 'malformatted id'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const editedBlog = {}
  if (body.author) editedBlog.author = body.author
  if (body.title) editedBlog.title = body.title
  if (body.url) editedBlog.url = body.url
  if (body.likes) editedBlog.likes = body.likes

  try {
    const blog = await Blog.findByIdAndUpdate(request.params.id, editedBlog, {new: true})
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    response.status(400).send({error: 'malformatted id'})
  }
})

module.exports = blogsRouter