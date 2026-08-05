import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

import { useState } from "react";

const Books = ({ show }) => {
  const { loading, data } = useQuery(ALL_BOOKS, {
    variables: {
      genre: null,
    },
  });
  const [genre, setGenre] = useState(null);

  if (!show) return null;

  if (loading) {
    return <div>loading...</div>;
  }

  console.log(data);

  const books = data.allBooks;

  const genres = [...new Set(books.flatMap((book) => book.genres))];

  const booksToShow = genre
    ? books.filter((book) => book.genres.includes(genre))
    : books;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {booksToShow.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}

        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
