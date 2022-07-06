import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("https://sockets-arduino.herokuapp.com/");

document.addEventListener("keypress", getKey);
function getKey(e) {
  const direcciones = {
    W: "F",
    S: "B",
    A: "L",
    D: "R",
  };
  socket.emit("actions", direcciones[e.code.toString().split("Key")[1]]);
}

const map = L.map("map").setView([9.024020420461316, -79.53228258324731], 20);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: "© OpenStreetMap",
}).addTo(map);

socket.on("client", (data) => {
  getPosition(data);
});

let marker;
function getPosition(position) {
  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker(position);
  const featureGroup = L.featureGroup([marker]).addTo(map);
  map.fitBounds(featureGroup.getBounds());
}
