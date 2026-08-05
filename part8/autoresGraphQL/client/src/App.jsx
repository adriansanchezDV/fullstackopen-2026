import { useState, useEffect } from "react";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    setPage("authors");
  };

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");

    if (token) {
      setToken(token);
    }
  }, []);

  const client = useApolloClient();

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

  const updateCache = (addedBook) => {
    client.cache.updateQuery(
      {
        query: ALL_BOOKS,
        variables: {
          genre: null,
        },
      },
      (data) => {
        if (!data) {
          return {
            allBooks: [addedBook],
          };
        }

        return {
          allBooks: [...data.allBooks, addedBook],
        };
      },
    );
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log("SUBSCRIPTION DATA:", data);
      const addedBook = data.data?.bookAdded;

      if (!addedBook) return;

      window.alert(`Nuevo libro añadido: ${addedBook.title}`);

      updateCache(addedBook);
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommended")}>
              recommendations
            </button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />

      {page === "authors" && token && <EditAuthor />}

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <LoginForm show={page === "login"} setToken={setToken} />

      <Recommended show={page === "recommended"} />
    </div>
  );
};

export default App;
