const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user

    const body = req.body

    if (!body.title || !body.url) {
      return res.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).end()
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: 'not allowed' })
    }

    await Blog.findByIdAndDelete(req.params.id)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes,
 
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
   blog,
    {
      new: true,              // mejor que returnDocument
      runValidators: true
    }
  ).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter