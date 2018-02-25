const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((a, b) => a + b.likes, 0)

const favoriteBlog = (blogs) => {
  let mostVotes = null;
  blogs.forEach(blog => {
    if (!mostVotes || blog.likes > mostVotes.likes) {
      mostVotes = blog
    }
  })
  return mostVotes
}

const mostBlogs = (blogs) => {
  let mostBlogsCount = 0;
  let mostBloggingAuthor = null;
  blogs.reduce((all, current) => {
    let existing = all.find(blog => blog.author === current.author);

    if (existing) {
      existing.blogs++
      if (existing.blogs > mostBlogsCount) {
        mostBloggingAuthor = existing
        mostBlogsCount = existing.blogs
      }
    }
    else {
      let firstOccurrence = {author: current.author, blogs: 1}
      if (mostBlogsCount === 0) {
        mostBloggingAuthor = firstOccurrence
        mostBlogsCount++
      }
      all.push(firstOccurrence)
    }

    return all
  }, [])
  return mostBloggingAuthor
}

const mostLikes = (blogs) => {
  let highestLikeCount = 0;
  let mostLikedAuthor = null;
  blogs.reduce((all, current) => {
    let existing = all.find(blog => blog.author === current.author);

    if (existing) {
      existing.likes += current.likes
      if (existing.likes > highestLikeCount) {
        mostLikedAuthor = existing
        highestLikeCount = existing.likes
      }
    }
    else {
      let firstOccurrence = {author: current.author, likes: current.likes}
      if (!mostLikedAuthor || firstOccurrence.likes > highestLikeCount) {
        mostLikedAuthor = firstOccurrence
        highestLikeCount = firstOccurrence.likes
      }
      all.push(firstOccurrence)
    }

    return all
  }, [])
  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}