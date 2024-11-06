const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("update", { message: "Hello from server!" });

  setInterval(() => {
    socket.emit("update", { message: "Real-time update from server" });
  }, 1000);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("WebSocket server running on http://localhost:3000");
});
