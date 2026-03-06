// --- Leaflet map setup ---
const calgary = [51.0447, -114.0719];
const map = L.map("map", { maxZoom: 19 }).setView(calgary, 11);

// Spiderfier for overlapping markers
const oms = new OverlappingMarkerSpiderfier(map);

// Marker cluster group (GLOBAL)
const markers = L.markerClusterGroup();
map.addLayer(markers);

// Base map
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

    // Clear old markers
    markers.clearLayers();

    permitLayer = L.geoJSON(data, {

      pointToLayer: function(feature, latlng) {

        const marker = L.marker(latlng, { spiderfyOnMaxZoom: true });

        // Register with spiderfier
        oms.addMarker(marker);

        return marker;
      },

      onEachFeature: function (feature, layer) {

        const p = feature.properties;

        layer.bindPopup(`
            <b>Address:</b> ${p.originaladdress || "N/A"}<br>
            <b>Issued Date:</b> ${p.issueddate || "N/A"}<br>
            <b>Work Class:</b> ${p.workclassgroup || "N/A"}<br>
            <b>Contractor:</b> ${p.contractorname || "N/A"}<br>
            <b>Community:</b> ${p.communityname || "N/A"}
            `);
      }
    });

    // Add to cluster group
    markers.addLayer(permitLayer);

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

  markers.clearLayers();

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