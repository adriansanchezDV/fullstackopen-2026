import { useDispatch } from "react-redux";
import {create} from '../reducers/anecdoteReducer'
import {setNotification} from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value;

    event.target.anecdote.value = "";

    dispatch(create(content));
    dispatch(setNotification(`You created a new anecdote: ${content}`));



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
