import { useField } from './hooks'

const App = () => {

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')


  const addAnecdote = (event) => {
    event.preventDefault()

    props.addNew({
      content: content.inputProps.value,
      author: author.inputProps.value,
      info: info.inputProps.value
    })

    content.reset()
    author.reset()
    info.reset()
  }


  return (
    <div>
      <h2>create a new anecdote</h2>

      <form onSubmit={addAnecdote}>

        <div>
          content:
          <input {...content.inputProps}/>
        </div>

        <div>
          author:
          <input {...author.inputProps}/>
        </div>

        <div>
          url for more info:
          <input {...info.inputProps}/>
        </div>


        <button>create</button>


        <button 
          type="button"
          onClick={() => {
            content.reset()
            author.reset()
            info.reset()
          }}
        >
          reset
        </button>

      </form>
    </div>
  )
}

export default App