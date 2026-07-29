import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
  const { loading, data } = useQuery(ALL_BOOKS);

  if (!show) return null;

  if (loading) {
    return <div>loading...</div>;
  }

  const books = data.allBooks;

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

          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
