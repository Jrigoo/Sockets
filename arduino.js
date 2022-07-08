const { SerialPort, ReadlineParser } = require("serialport");
const { io } = require("socket.io-client");

const port = new SerialPort({ path: "COM14", baudRate: 9600, autoOpen: true });
const parser = new ReadlineParser();
const socket = io("https://sockets-arduino.herokuapp.com/");
port.pipe(parser);

function coordenadas(t) {
  let l = t / 100;
  let dd = Math.round(l);
  let mm = ((l - dd) * 100) / 60;
  return dd + mm;
}

/* parser.on("data", (gpsData) => {
  if (gpsData.toString().includes("$GPGGA")) {
    gpsData = gpsData.split(",");
    const latitud = gpsData[2];
    const longitud = gpsData[4];
    const satelites = gpsData[7];

    socket.emit("gpsData", [coordenadas(latitud), -coordenadas(longitud)]); 
    console.log([coordenadas(latitud), -coordenadas(longitud)]);
  }
}); */

/* 
socket.on("actions", (arg, callback) => {
  console.log(`Connected: ${arg}4`);
  port.write(`${arg}4`);
});
 */

const DATA = [
  [9.024063108878817, -79.53243266384139],
  [9.02378761144485, -79.53273307121476],
  [9.023411450744737, -79.53321050394801],
  [9.022961115913693, -79.53374158087462],
  [9.022452504656108, -79.53354846211953],
  [9.022134622740987, -79.5333553422828],
  [9.021922701518589, -79.53316222302833],
];

let i = 0;
setInterval(() => {
  if (DATA.length == i) {
    i = 0;
  }
  console.log(DATA[i]);
  socket.emit("gpsData", DATA[i]);
  i++;
}, 1000);
