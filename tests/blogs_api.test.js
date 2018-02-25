const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./utils/test_helper')

describe('when there is initially some blogs saved', async () => {

  beforeEach(async () => {
    await Blog.remove({})

    const blogObjects = helper.initialBlogs.map(b => new Blog(Blog.format(b)))
    await Promise.all(blogObjects.map(b => b.save()))
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await helper.blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedContents = response.body.map(b => b.content)
    blogsInDatabase.forEach(blog => {
      expect(returnedContents).toContain(blog.content)
    })
  })

  describe('addition of a new blog', async () => {

    test('POST /api/blogs succeeds with valid data', async () => {
      const initialBlogs = await helper.blogsInDb()

      const newBlog = {
        title: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
        author: 'Devaaja',
        url: 'dot.org',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterPost = await helper.blogsInDb()

      expect(blogsAfterPost.length).toBe(initialBlogs.length + 1)
      const addedBlog = blogsAfterPost.find(b => b.title === newBlog.title)
      expect(addedBlog).toBeDefined()
    })

    test('POST /api/blogs succeeds with data missing "likes" property and initializes said property to zero', async () => {
      const initialBlogs = await helper.blogsInDb()

      const newBlog = {
        title: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
        author: 'Devaaja',
        url: 'dot.org'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterPost = await helper.blogsInDb()

      expect(blogsAfterPost.length).toBe(initialBlogs.length + 1)
      const addedBlog = blogsAfterPost.find(b => b.title === newBlog.title)
      expect(addedBlog).toBeDefined()
      expect(addedBlog.likes).toBe(0)
    })

    test('POST /api/blogs fails when property "title" is missing', async () => {
      const initialBlogs = await helper.blogsInDb()

      const blogWithoutTitle = {
        author: 'Devaaja',
        url: 'dot.org',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)

      const blogsAfterPost = await helper.blogsInDb()
      expect(blogsAfterPost.length).toBe(initialBlogs.length)
    })

    test('POST /api/blogs fails when property "url" is missing', async () => {
      const initialBlogs = await helper.blogsInDb()

      const blogWithoutUrl = {
        title: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
        author: 'Devaaja',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)

      const blogsAfterPost = await helper.blogsInDb()
      expect(blogsAfterPost.length).toBe(initialBlogs.length)
    })
  })

  afterAll(() => {
    server.close()
  })
})