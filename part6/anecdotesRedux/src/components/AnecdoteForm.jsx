import { useDispatch } from "react-redux";
import {setNotification} from '../reducers/notificationReducer'
import { createAnecdotes } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value;

    event.target.anecdote.value = "";

    dispatch(createAnecdotes(content))



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
