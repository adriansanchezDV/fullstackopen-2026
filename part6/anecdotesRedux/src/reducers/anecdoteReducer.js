
import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from "../services/anecdotes";



const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState:[],
  reducers:{
    vote(state, action) {
  return state.map(anecdote =>
    anecdote.id === action.payload.id
      ? action.payload
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

const {setAnecdotes, create, vote}=  anecdotesSlice.actions

export const initializeAnecdotes= () =>{
  return async (dispatch)=>{
    const anecdotes= await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdotes=(content)=>{
  return async (dispatch)=>{
    const newAnecdote= await anecdoteService.createNew(content)
    dispatch(create(newAnecdote))
  }
}

export const incrementVotes=(anecdote)=>{
  return async (dispatch)=>{
    const newVote= await anecdoteService.updateVotes(anecdote)
    dispatch(vote(newVote))
  }
}






export default anecdotesSlice.reducer