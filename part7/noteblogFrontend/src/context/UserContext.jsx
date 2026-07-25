import { createContext, useContext, useReducer } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload

    case 'LOGOUT':
      return null

    default:
      return state
  }
}

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const value = useContext(UserContext)

  if (!value) {
    throw new Error('useUserValue must be used inside UserContextProvider')
  }

  return value[0]
}

export const useUserDispatch = () => {
  const value = useContext(UserContext)
  return value[1]
}
