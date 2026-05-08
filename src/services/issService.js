import axios from "axios";

const WHERETHEISS_API = "https://api.wheretheiss.at/v1/satellites/25544";
const OPENNOTIFY_ISS = "http://api.open-notify.org/iss-now.json";
const OPENNOTIFY_ASTROS = "http://api.open-notify.org/astros.json";

const PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url=",
  "https://thingproxy.freeboard.io/fetch/",
];

// SIMULATOR LOGIC: Prediction based on orbital mechanics
// The ISS moves approx 4 degrees every 15 minutes (approx 0.06 deg per 15s)
let simulatedLat = 45.0;
let simulatedLng = -120.0;

const fetchWithProxy = async (url, proxyIndex = 0) => {
  if (proxyIndex >= PROXIES.length) throw new Error("All proxies failed");
  try {
    const response = await axios.get(`${PROXIES[proxyIndex]}${encodeURIComponent(url)}`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    return fetchWithProxy(url, proxyIndex + 1);
  }
};

export const fetchISSLocation = async () => {
  try {
    const response = await axios.get(WHERETHEISS_API, { timeout: 3000 });
    const data = {
      lat: response.data.latitude,
      lng: response.data.longitude,
      velocity: response.data.velocity || 27600,
      timestamp: response.data.timestamp,
      isSimulated: false
    };
    // Sync simulator with real data
    simulatedLat = data.lat;
    simulatedLng = data.lng;
    return data;
  } catch (error) {
    console.warn("External APIs rate-limited or blocked. Engaging Orbital Simulator...");
    
    // Simulate ISS movement (Approx 0.06 degrees per 15 seconds)
    simulatedLng += 0.06;
    if (simulatedLng > 180) simulatedLng = -180;
    
    // Simple sine wave for latitude to mimic orbital path
    simulatedLat = 51.6 * Math.sin(Date.now() / 1000000); 

    return {
      lat: simulatedLat,
      lng: simulatedLng,
      velocity: 27600 + (Math.random() * 10 - 5),
      timestamp: Math.floor(Date.now() / 1000),
      isSimulated: true
    };
  }
};

export const fetchAstronauts = async () => {
  try {
    const data = await fetchWithProxy(OPENNOTIFY_ASTROS);
    return { ...data, isSimulated: false };
  } catch (error) {
    return {
      isSimulated: true,
      number: 7,
      people: [
        { name: "Oleg Kononenko", craft: "ISS" },
        { name: "Nikolai Chub", craft: "ISS" },
        { name: "Tracy Caldwell Dyson", craft: "ISS" },
        { name: "Matthew Dominick", craft: "ISS" },
        { name: "Michael Barratt", craft: "ISS" },
        { name: "Jeanette Epps", craft: "ISS" },
        { name: "Alexander Grebenkin", craft: "ISS" }
      ]
    };
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`, { timeout: 3000 });
    const address = response.data.address;
    if (!address) return "Over Remote Ocean / Area";
    const city = address.city || address.town || address.village || address.suburb;
    const country = address.country;
    if (city && country) return `Near ${city}, ${country}`;
    if (country) return `Over ${country}`;
    return 'Over Remote Ocean / Area';
  } catch (error) {
    return 'Over Remote Ocean / Area';
  }
};
