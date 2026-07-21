import anecdotes from "../../anecdotesRedux/src/services/anecdotes";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to get anecdotes");
  }

  return await response.json();
};

export const createAnecdote = async (newAnecdote) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAnecdote),
  };

  const response = await fetch(baseUrl, options);

   if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
};

export const updateAnecdote = async (updatedAnecdotes) => {
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAnecdotes),
  };

  const response = await fetch(`${baseUrl}/${updatedAnecdotes.id}`, options);

  if (!response.ok) {
    throw new Error("Failed to create anecdote");
  }

  return await response.json();
};
