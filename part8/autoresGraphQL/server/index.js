const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");

const User = require("./models/User");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");
require("dotenv").config();
mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET =", JWT_SECRET);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting MongoDB", error.message);
  });

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
`;

const resolvers = {
  Query: {
    allBooks: async (root, args) => {
      if (args.genre) {
        return Book.find({
          genres: args.genre,
        });
      }

      return Book.find({});
    },

    allAuthors: async () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Book: {
    author: async (root) => {
      return Author.findById(root.author);
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({
        author: root._id,
      });

      return books.length;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      try {
        let author = await Author.findOne({
          name: args.author,
        });

        if (!author) {
          author = new Author({
            name: args.author,
          });

          await author.save();
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        });

        await book.save();

        return book;
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated");
      }
      try {
        const author = await Author.findOne({
          name: args.name,
        });

        if (!author) {
          return null;
        }

        author.born = args.setBornTo;

        await author.save();

        return author;
      } catch (error) {
        throw new GraphQLError("Updating author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        passwordHash: "password",
      });

      return user.save();
    },
    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username,
      });

      if (!user || args.password !== "password") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, JWT_SECRET),
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },

  context: async ({ req }) => {
    const auth = req?.headers.authorization;

    if (auth && auth.startsWith("Bearer ")) {
      try {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET,
        );

        const currentUser = await User.findById(decodedToken.id);

        return { currentUser };
      } catch (error) {
        console.log(error);
        return {};
      }
    }

    return {};
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
