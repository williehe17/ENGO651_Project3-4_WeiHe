// --- Leaflet map setup ---
const calgary = [51.0447, -114.0719];
const map = L.map("map").setView(calgary, 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let permitLayer;

// --- Date range picker ---
flatpickr("#dateRange", {
  mode: "range",
  dateFormat: "Y-m-d"
});

const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");
const dateRangeEl = document.getElementById("dateRange");

searchBtn.addEventListener("click", async () => {

  const dates = dateRangeEl.value.split(" to ");

  if (dates.length !== 2) {
    statusEl.textContent = "Please select a date range";
    return;
  }

  const startDate = dates[0];
  const endDate = dates[1];

  statusEl.textContent = "Loading permits...";

  try {

    const data = await fetchPermits(startDate, endDate);

    if (!data.features || data.features.length === 0) {
      statusEl.textContent = "No permits found for this date range.";
      return;
    }

    if (permitLayer) {
      map.removeLayer(permitLayer);
    }

    permitLayer = L.geoJSON(data, {

      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: "red",
          color: "#000",
          weight: 1,
          fillOpacity: 0.8
        });
      },

      onEachFeature: function (feature, layer) {

        const p = feature.properties;

        layer.bindPopup(`
          <b>Address:</b> ${p.originaladdress || "N/A"}<br>
          <b>Permit Type:</b> ${p.permittype || "N/A"}<br>
          <b>Issued Date:</b> ${p.issueddate || "N/A"}
        `);

      }

    }).addTo(map);

    map.fitBounds(permitLayer.getBounds());

    statusEl.textContent = `Loaded ${data.features.length} permits`;

  } catch (error) {
    console.error(error);
    statusEl.textContent = "Error loading permit data.";
  }

});

clearBtn.addEventListener("click", () => {

  dateRangeEl.value = "";
  statusEl.textContent = "";

  if (permitLayer) {
    map.removeLayer(permitLayer);
  }

});

// --- Calgary Open Data API ---
const API_URL = "https://data.calgary.ca/resource/c2es-76ed.geojson";

async function fetchPermits(startDate, endDate) {

  const where = `issueddate >= '${startDate}' AND issueddate <= '${endDate}'`;

  const params = new URLSearchParams({
    "$where": where,
    "$limit": 5000
  });

  const url = `${API_URL}?${params.toString()}`;

  const response = await fetch(url);

  return response.json();
}