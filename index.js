const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["*", "http://localhost:5500", "http://127.0.0.1:5500"],
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Hello to ta cool</h1>");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["*", "http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {
  socket.on("data", (arg, callback) => {
    io.sockets.emit("client", arg);
  });
});

server.listen(process.env.PORT || 5000);
