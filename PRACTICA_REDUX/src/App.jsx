import store from "./store";

const App = () => {
  return (
    <div>
      <ul>
        {store.getState().map(note => (
          <li key={note.id}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;
