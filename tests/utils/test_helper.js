const Blog = require('../../models/blog')
const User = require('../../models/user')
const dummyBlogs = require('./dummy_blogs')

const initialBlogs = dummyBlogs.blogs

const initialUsers = [
  {
    name: 'Tester',
    username: 'test',
    passwordHash: 'secret hash',
    adult: true
  },
  {
    name: 'Nobody',
    username: 'testing',
    passwordHash: 'secret hash',
    adult: false
  },
]

const blogsInDb = async () => {
  return await Blog.find({})
}

const usersInDb = async () => {
  return await User.find({})
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb
}

