const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const Person = require("../models/Person");
const User = require("../models/user");

const pubsub = require("../config/pubsub");
const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),

    allPersons: async (root, args) => {
      if (!args.phone) {
        return await Person.find({}).populate("friendOf");
      }

      return await Person.find({
        phone: {
          $exists: args.phone === "YES",
        },
      }).populate("friendOf");
    },

    findPerson: async (root, args) => {
      return await Person.findOne({
        name: args.name,
      }).populate("friendOf");
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
        friendOf: [currentUser._id],
      });

      try {
        await person.save();
        await person.populate("friendOf");

        currentUser.friends = currentUser.friends.concat(person);

        await currentUser.save();

        console.log("Publicando suscripción", person.name);

        pubsub.publish("PERSON_ADDED", {
          personAdded: person,
        });
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

      if (
        !person.friendOf
          .map((user) => user.toString())
          .includes(currentUser._id.toString())
      ) {
        person.friendOf.push(currentUser._id);

        await person.save();
      }

      return currentUser;
    },
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterableIterator(["PERSON_ADDED"]),
    },
  },
};
module.exports = resolvers;
