// Calgary center
const calgary = [51.0447, -114.0719];

// Create map
const map = L.map("map").setView(calgary, 11);

// Add basemap tiles (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);