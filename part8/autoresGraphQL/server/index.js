const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

let authors = [
  {
    id: "1",
    name: "Robert Martin",
    born: 1952,
  },
  {
    id: "2",
    name: "Martin Fowler",
    born: 1963,
  },
  {
    id: "3",
    name: "Fyodor Dostoevsky",
    born: 1821,
  },
  {
    id: "4",
    name: "Joshua Kerievsky",
    born: 1970,
  },
  {
    id: "5",
    name: "Sandi Metz",
    born: 1958,
  },
];

let books = [
  {
    id: "1",
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    id: "2",
    title: "Refactoring",
    published: 1999,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    id: "3",
    title: "Crime and Punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic"],
  },
  {
    id: "4",
    title: "The Pragmatic Programmer",
    published: 1999,
    author: "Robert Martin",
    genres: ["programming"],
  },
  {
    id: "5",
    title: "Practical Object-Oriented Design",
    published: 2012,
    author: "Sandi Metz",
    genres: ["programming"],
  },
];

const typeDefs = `#graphql

type Author {
  id: ID!
  name: String!
  born: Int
  bookCount: Int!
}

type Book {
  id: ID!
  title: String!
  published: Int!
  author: String!
  genres: [String!]!
}

type Query {
  allAuthors: [Author!]!
  allBooks: [Book!]!
}
  
    type Mutation {
  addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  ): Book


  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author
}
`;

const resolvers = {
  Query: {
    allAuthors: () => authors,
    allBooks: () => books,
  },

  Author: {
    bookCount: (root) =>
      books.filter((book) => book.author === root.name).length,
  },
  Mutation: {
    addBook: (root, args) => {
      // Si el autor no existe, lo añadimos
      const authorExists = authors.find((a) => a.name === args.author);

      if (!authorExists) {
        const newAuthor = {
          id: String(authors.length + 1),
          name: args.author,
          born: null,
        };

        authors.push(newAuthor);
      }

      const newBook = {
        id: String(books.length + 1),
        title: args.title,
        author: args.author,
        published: args.published,
        genres: args.genres,
      };

      books.push(newBook);

      return newBook;
    },

    editAuthor: (root, args) => {
      const author = authors.find((author) => author.name === args.name);

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;

      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
