import { useDispatch } from "react-redux";
import {create} from '../reducers/anecdoteReducer'
import {setNotification} from '../reducers/notificationReducer'
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value;

    event.target.anecdote.value = "";

    const newAnecdote = await anecdoteService.createNew(content)
       dispatch(create(newAnecdote))



  };

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addAnecdote}>
        <input name="anecdote" />

        <button>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
