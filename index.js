const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

io.on("connection", (socket) => {
  console.log("User connected " + socket.id);
  socket.on("chat message", (msg) => {
    const toSend = {
      id: uuidv4(),
      message: msg.value,
      userId: socket.id,
    };
    io.emit("chat message", toSend);
  });

  socket.on("disconnect", () => {
    console.log("User connected " + socket.id);
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
