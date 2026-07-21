import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {  useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "./requests"
import { useNotificationDispatch } from "./components/NotificationContext";
const App = () => {

const queryClient= useQueryClient()
const dispatch = useNotificationDispatch()

 
   const updateVotesMutation = useMutation({
  mutationFn: updateAnecdote,

  onSuccess: (updatedAnecdote) => {

    queryClient.invalidateQueries({
      queryKey: ['anecdotes']
    })

    dispatch({
      type: 'SHOW',
      payload: `you voted '${updatedAnecdote.content}'`
    })

    setTimeout(() => {
      dispatch({
        type: 'HIDE'
      })
    }, 5000)
  }
})
  
     const handleVote = (anecdote) => {

    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    updateVotesMutation.mutate(updatedAnecdote)
  }


  const result = useQuery({
      queryKey: ["anecdotes"],
      queryFn: getAnecdotes,
      retry: false
       
    });
  
    console.log(JSON.parse(JSON.stringify(result)));
  
    if (result.isLoading) {
      return <div>anecdote service not avaliable due to problems in server</div>;
    }
  
    const anecdotes = result.data;

 

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App