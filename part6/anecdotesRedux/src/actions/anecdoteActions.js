const createAnecdote = content => {

  return {
    type: 'CREATE',
    payload: content
  }

}

const voteAnecdote = id => {
  return {
    type: 'VOTE',
    payload: id
  }
}

export { createAnecdote, voteAnecdote }