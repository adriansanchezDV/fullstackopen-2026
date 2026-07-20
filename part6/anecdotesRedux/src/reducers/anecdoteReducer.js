
import { createSlice } from '@reduxjs/toolkit'



const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState:[],
  reducers:{
    vote(state, action){
      const id = action.payload
      return state.map(anecdote =>
        anecdote.id === id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      )
    },
    create(state, action)  {
     state.push(action.payload)
      
    },
    setAnecdotes(state, action){
      return action.payload;
    }
  }
})

export const { vote, create, setAnecdotes } = anecdotesSlice.actions

export default anecdotesSlice.reducer