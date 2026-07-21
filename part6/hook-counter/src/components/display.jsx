import { useContext } from 'react'
import CounterContext from './counterContext'


const Display = () => {
  const { counter } = useContext(CounterContext)

  return <div>{counter}</div>
}

export default Display