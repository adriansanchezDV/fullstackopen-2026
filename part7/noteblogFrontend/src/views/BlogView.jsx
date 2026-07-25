import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useUserValue } from '../context/UserContext'
import { useState } from 'react'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useUserValue()
  const [comment, setComment] = useState('')

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blog = blogs.find((blog) => blog.id === id)

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      })

      navigate('/')
    },
  })

  const deleteBlog = () => {
    const ok = window.confirm(`Delete '${blog.title}' by ${blog.author}?`)

    if (!ok) return

    deleteBlogMutation.mutate(blog.id)
  }

  if (!blog) {
    return <div>Loading...</div>
  }

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      })

      setComment('')
    },
  })

  const sendComment = (event) => {
    event.preventDefault()

    commentMutation.mutate({
      id: blog.id,
      comment,
    })
  }

  return (
    <div className="blog-view">
      <h2>{blog.title}</h2>

      <div>{blog.url}</div>

      <div>
        likes {blog.likes}
        <button className="button">like</button>
      </div>

      <div>added by {blog.user.name}</div>

      {blog.user.username === user.username && (
        <button className="button danger" onClick={deleteBlog}>
          delete
        </button>
      )}

      <h3 className="comments-title">Comments</h3>
      <ul className="comments-list">
        {blog.comments?.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>

      <form className="comment-form" onSubmit={sendComment}>
        <input
          className="comment-input"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />

        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default BlogView
