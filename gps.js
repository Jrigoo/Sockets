const { SerialPort, ReadlineParser } = require("serialport");
const { io } = require("socket.io-client");

const port = new SerialPort({ path: "COM14", baudRate: 9600 });
const parser = new ReadlineParser();
port.pipe(parser);

const socket = io("https://sockets-arduino.herokuapp.com/");
socket.on("connection", console.log("Connected!"));

function cor(t) {
  let l = t / 100;
  let dd = Math.round(l);
  let mm = ((l - dd) * 100) / 60;
  let corde = dd + mm;
  return corde;
}

parser.on("data", (gpsData) => {
  if (gpsData.toString().includes("$GPGGA")) {
    gpsData = gpsData.split(",");
    const latitud = gpsData[2];
    const longitud = gpsData[4];
    const satelites = gpsData[7];

    socket.emit("gpsData", [cor(latitud), -cor(longitud)]);
    console.log([cor(latitud), -cor(longitud)]);
  }
});
