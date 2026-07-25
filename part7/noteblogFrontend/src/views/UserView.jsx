import { useQuery } from '@tanstack/react-query'
import blogs from '../services/blogs'
import userService from '../services/users'
import Users from '../components/Users'
import { useParams } from 'react-router-dom'
const UserView = () => {
  const { id } = useParams()

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const user = users.find((users) => users.id === id)

  if (!user) {
    return <h1>Loading...</h1>
  }

  if (!blogs) {
    return <h1>Loading...</h1>
  }
  return (
    <div className="user-view">
      <h1 className="user-name">{user.name}</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>BLOGS</th>
          </tr>
        </thead>
        <tbody>
          {user.blogs.length === 0 ? (
            <tr>
              <td className="empty-message">No blogs added yet</td>
            </tr>
          ) : (
            user.blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserView
