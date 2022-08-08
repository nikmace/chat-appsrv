const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

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
      message: msg.value.message,
      username: msg.value.username,
      sex: msg.value.sex,
      sessionId: socket.id,
    };
    io.emit("chat message", toSend);
  });

  socket.on("disconnect", () => {
    console.log("User connected " + socket.id);
  });
});

server.listen(process.env.PORT || 3001, process.env.HOST || "0.0.0.0", () => {
  console.log("listening on *:3001");
});
