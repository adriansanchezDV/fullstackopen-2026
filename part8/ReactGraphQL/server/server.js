const connectDB = require("./config/db");

const startServer = require("./app");

const PORT = 4000;

const start = async () => {
  await connectDB();

  const httpServer = await startServer();

  httpServer.listen(PORT, () => {
    console.log(`HTTP Server ready at http://localhost:${PORT}/graphql`);

    console.log(`WebSocket Server ready at ws://localhost:${PORT}/graphql`);
  });
};

start();
