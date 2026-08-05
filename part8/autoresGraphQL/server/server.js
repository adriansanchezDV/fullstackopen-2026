const express = require("express");
const http = require("http");
const cors = require("cors");

const { expressMiddleware } = require("@as-integrations/express5");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const { server, schema } = require("./app");
const context = require("./context");

const app = express();

app.use(cors());

const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer(
  {
    schema,
  },
  wsServer,
);

const start = async () => {
  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context,
    }),
  );

  httpServer.listen(4000, () => {
    console.log("HTTP Server ready at http://localhost:4000/graphql");

    console.log("WebSocket Server ready at ws://localhost:4000/graphql");
  });
};

start();
