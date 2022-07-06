const { SerialPort, ReadlineParser } = require("serialport");
const { io } = require("socket.io-client");

const port = new SerialPort({ path: "COM13", baudRate: 9600, autoOpen: true });
//const parser = new ReadlineParser();
//port.pipe(parser);

const socket = io("https://sockets-arduino.herokuapp.com/");
socket.on("connection", console.log("ta cool!"));
socket.on("actions", (arg, callback) => {
  console.log(`Connected: ${arg}`);
  port.write(arg);
});
