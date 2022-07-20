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

app.get("/", (req, res) => {
  res.send("<h1>Hello to ta cool!</h1>");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["content-type"],
    },
  },
});

io.on("connection", (socket) => {
  socket.on("gpsData", (arg, callback) => {
    io.sockets.emit("client", arg);
  });
  socket.on("cData", (arg, callback) => {
    io.sockets.emit("camara", arg);
  });
  socket.on("dData", (arg, callback) => {
    io.sockets.emit("distance", arg);
  });
  socket.on("tempData", (arg, callback) => {
    io.sockets.emit("temperature", arg);
  });
});

server.listen(process.env.PORT || 3000);
console.log(`Server on http://localhost:3000`);
