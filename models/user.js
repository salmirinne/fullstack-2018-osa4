const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  username: {type: String, required: true},
  passwordHash: {type: String, required: true},
  adult: {type: Boolean, default: true},
  blogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    adult: user.adult,
    blogs: user.blogs
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User