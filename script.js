let map;

// List of Ethiopian cities with coordinates
const cities = [
  { name: "Addis Ababa", lat: 9.03, lng: 38.74 },
  { name: "Dire Dawa", lat: 9.6, lng: 41.8661 },
  { name: "Mekelle", lat: 13.4967, lng: 39.4753 },
  { name: "Bahir Dar", lat: 11.5742, lng: 37.3615 },
  { name: "Awasa", lat: 7.0621, lng: 38.4767 },
  { name: "Gondar", lat: 12.6, lng: 37.4667 },
  { name: "Adama (Nazret)", lat: 8.54, lng: 39.27 },
  { name: "Harar", lat: 9.31, lng: 42.12 },
  { name: "Jimma", lat: 7.6667, lng: 36.8333 },
  { name: "Dessie", lat: 11.13, lng: 39.63 },
  { name: "Shashamane", lat: 7.2, lng: 38.6 },
  { name: "Bishoftu", lat: 8.75, lng: 39.01 },
  { name: "Debre Berhan", lat: 9.68, lng: 39.53 },
  { name: "Arba Minch", lat: 6.04, lng: 37.55 },
  { name: "Dila", lat: 6.4167, lng: 38.3167 },
  { name: "Hosaena", lat: 7.55, lng: 37.85 },
  { name: "Assosa", lat: 10.0667, lng: 34.5333 },
  { name: "Gambela", lat: 8.25, lng: 34.5833 },
  { name: "Metu", lat: 8.3, lng: 35.5833 },
  { name: "Nekemte", lat: 9.0833, lng: 36.5667 },
];

let markers = [];

// Initialize Leaflet map
function initMap() {
  map = L.map("map").setView([9.03, 38.74], 6); // Centered on Addis Ababa

  // Add OpenStreetMap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Iterate over each city and fetch air pollution data
  cities.forEach((city) => {
    fetch(
      `https://api.waqi.info/feed/geo:${city.lat};${city.lng}/?token=29824b3dcec85366109d0a757011af856c12e12e`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          const aqi = data.data.aqi;
          const status = getPollutionStatus(aqi);

          // Create a marker for the city
          const marker = L.marker([city.lat, city.lng]).addTo(map);
          marker.bindPopup(`
            <div>
              <h3>${city.name}</h3>
              <p><strong>Air Quality Index (AQI):</strong> ${aqi}</p>
              <p><strong>Status:</strong> ${status}</p>
            </div>
          `);

          // Add marker to global markers array for search
          markers.push({ name: city.name.toLowerCase(), marker });
        } else {
          console.error(`No data available for ${city.name}`);
        }
      })
      .catch((error) =>
        console.error(`Error fetching data for ${city.name}:`, error)
      );
  });
}

// Function to determine air quality status based on AQI value
function getPollutionStatus(aqi) {
  if (aqi <= 50) {
    return "Good";
  } else if (aqi <= 100) {
    return "Moderate";
  } else if (aqi <= 150) {
    return "Unhealthy for Sensitive Groups";
  } else if (aqi <= 200) {
    return "Unhealthy";
  } else if (aqi <= 300) {
    return "Very Unhealthy";
  } else {
    return "Hazardous";
  }
}

// Add city search functionality
function searchCity() {
  const query = document.getElementById("city-search").value.toLowerCase();
  const result = markers.find((item) => item.name === query);

  if (result) {
    map.setView(result.marker.getLatLng(), 10); // Zoom to the city
    result.marker.openPopup(); // Open the city's popup
  } else {
    alert("City not found. Please check the spelling.");
  }
}

// Initialize the map
initMap();
