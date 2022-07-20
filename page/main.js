import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("https://sockets-arduino.herokuapp.com/");
//const temperature = document.getElementById("temperature");
const coordenadas = document.getElementById("coordenadas");

const map = L.map("map").setView([9.024020420461316, -79.53228258324731], 20);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

socket.on("client", (data) => {
  console.log(`GPS Data: ${data}`);
  getPosition(data);
  coordenadas.innerHTML = `${data[0]}, ${data[1]}`;
});

/* socket.on("temperature", (data) => {
  //console.log(`Temperature Data: ${data}`);
  temperature.innerHTML = `${data} grados`;
});*/

let marker;
function getPosition(position) {
  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker(position);
  const featureGroup = L.featureGroup([marker]).addTo(map);
  map.fitBounds(featureGroup.getBounds());
}
