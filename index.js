const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://sockets-jrigoo.netlify.app/",
      "https://jrigoo.github.io/Sockets/",
    ],
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Hello to ta cool</h1>");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://sockets-jrigoo.netlify.app/",
      "https://jrigoo.github.io/Sockets/",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("data", (arg, callback) => {
    io.sockets.emit("client", arg);
  });
});

server.listen(process.env.PORT || 5000);
