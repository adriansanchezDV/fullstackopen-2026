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
  author: Author!
  genres: [String!]!
}

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  allAuthors: [Author!]!
  allBooks(
    genre: String
  ): [Book!]!

  me: User
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

  createUser(
    username: String!
    favoriteGenre: String!
  ): User

  login(
    username: String!
    password: String!
  ): Token
}

type Subscription {
    bookAdded: Book!
}
`;

module.exports = typeDefs;
