const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const { PubSub } = require("graphql-subscriptions");

const Author = require("../models/author");
const Book = require("../models/book");
const User = require("../models/User");

const { JWT_SECRET } = require("../config/config");

const pubsub = new PubSub();

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
      const authors = await Author.find({});
      const books = await Book.find({});

      return authors.map((author) => {
        const bookCount = books.filter(
          (book) => book.author.toString() === author._id.toString(),
        ).length;

        return {
          id: author._id.toString(),
          name: author.name,
          born: author.born,
          bookCount,
        };
      });
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

        pubsub.publish("BOOK_ADDED", {
          bookAdded: book,
        });

        return book;
      } catch (error) {
        console.log(error);

        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
