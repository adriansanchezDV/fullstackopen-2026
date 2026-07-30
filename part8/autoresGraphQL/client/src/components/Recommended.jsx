import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from "../queries";

const Recommended = ({ show }) => {
  const { loading: meLoading, data: meData } = useQuery(ME);

  const favoriteGenre = meData?.me.favoriteGenre;

  const { loading, data } = useQuery(ALL_BOOKS, {
    variables: {
      genre: favoriteGenre,
    },
    skip: !favoriteGenre,
  });

  if (!show) return null;

  if (meLoading || loading) {
    return <div>loading...</div>;
  }

  const books = data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
