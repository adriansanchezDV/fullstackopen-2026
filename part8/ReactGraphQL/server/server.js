const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting MongoDB", error.message);
  });

const Person = require("./models/Person");

const typeDefs = /* GraphQL */ `
  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person

    createUser(username: String!): User

    login(username: String!, password: String!): Token

    addAsFriend(name: String!): User
  }
`;

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),

    allPersons: async (root, args) => {
      if (!args.phone) {
        return await Person.find({});
      }

      return await Person.find({
        phone: {
          $exists: args.phone === "YES",
        },
      });
    },

    findPerson: async (root, args) => {
      return await Person.findOne({
        name: args.name,
      });
    },

    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Person: {
    address: (root) => ({
      street: root.street,
      city: root.city,
    }),
  },

  Mutation: {
    addPerson: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const person = new Person({
        ...args,
      });

      try {
        await person.save();

        currentUser.friends = currentUser.friends.concat(person);

        await currentUser.save();
      } catch (error) {
        throw new GraphQLError("Saving person failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }

      return person;
    },

    editNumber: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const person = await Person.findOne({
        name: args.name,
      });

      if (!person) {
        return null;
      }

      person.phone = args.phone;

      try {
        return await person.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
      });

      try {
        return await user.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username,
      });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
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
        value: jwt.sign(userForToken, process.env.JWT_SECRET),
      };
    },
    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const person = await Person.findOne({
        name: args.name,
      });

      if (!person) {
        throw new GraphQLError("Person not found", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const alreadyFriend = currentUser.friends
        .map((friend) => friend._id.toString())
        .includes(person._id.toString());

      if (!alreadyFriend) {
        currentUser.friends = currentUser.friends.concat(person);
      }

      await currentUser.save();

      return currentUser;
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
    const auth = req ? req.headers.authorization : null;

    console.log("Authorization:", auth);

    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET,
      );

      console.log("Decoded:", decodedToken);

      const currentUser = await User.findById(decodedToken.id).populate(
        "friends",
      );

      console.log("Current user:", currentUser);

      return { currentUser };
    }

    return {};
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
