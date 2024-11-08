const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Vite dev server origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Ensure the server listens on port 3001
httpServer.listen(3001, () => {
  console.log("Socket.io server running on port 3001");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle the 'create-something' event
  socket.on("create-something", (value, callback) => {
    console.log("Received from client:", value); // Log value received from client

    // Respond to client with a message
    callback(`Server received: ${value}`); // Send back a response to the client
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

module.exports = io;
