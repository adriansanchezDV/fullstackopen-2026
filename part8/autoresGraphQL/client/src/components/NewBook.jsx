import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADD_BOOK, ALL_BOOKS } from "../queries";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const uniqByTitle = (books) => {
    const seen = new Set();

    return books.filter((book) => {
      if (seen.has(book.title)) {
        return false;
      }

      seen.add(book.title);
      return true;
    });
  };

  const [addBook] = useMutation(ADD_BOOK);

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    });

    setTitle("");
    setAuthor("");
    setPublished("");
    setGenre("");
    setGenres([]);
  };

  const addGenre = () => {
    if (genre.trim() === "") return;

    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <h2>add book</h2>

      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>

        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button type="button" onClick={addGenre}>
            add genre
          </button>
        </div>

        <div>{genres.join(" ")}</div>

        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
