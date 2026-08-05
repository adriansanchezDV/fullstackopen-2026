const express = require("express");
const http = require("http");

const { ApolloServer } = require("@apollo/server");

const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { expressMiddleware } = require("@as-integrations/express5");

const { makeExecutableSchema } = require("@graphql-tools/schema");

const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const context = require("./graphql/context");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();
const cors = require("cors");

const httpServer = http.createServer(app);

const server = new ApolloServer({
  schema,

  plugins: [
    ApolloServerPluginDrainHttpServer({
      httpServer,
    }),
  ],
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer(
  {
    schema,

    context: async (ctx) => {
      return {};
    },
  },
  wsServer,
);

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    cors({
      origin: "http://localhost:5173",
    }),
    express.json(),
    expressMiddleware(server, {
      context,
    }),
  );

  return httpServer;
};

module.exports = startServer;
