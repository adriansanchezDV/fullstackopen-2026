import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import Users from '../components/Users'

const UsersView = () => {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  console.log(users)

  return <Users users={users} />
}

export default UsersView
