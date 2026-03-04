// --- Leaflet map setup (REQUIRED) ---
const calgary = [51.0447, -114.0719];
const map = L.map("map").setView(calgary, 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// --- Date range picker setup ---
flatpickr("#dateRange", {
  mode: "range",
  dateFormat: "Y-m-d"
});

const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");
const dateRangeEl = document.getElementById("dateRange");

searchBtn.addEventListener("click", () => {
  statusEl.textContent = `Selected: ${dateRangeEl.value || "(none)"}`;
});

clearBtn.addEventListener("click", () => {
  dateRangeEl.value = "";
  statusEl.textContent = "";
});