# 🚀 SpacePulse Dashboard

A full-stack, production-ready orbital intelligence dashboard built with React, Vite, and Tailwind CSS. Track the International Space Station in real-time, analyze global space news, and interact with a context-aware AI mission assistant.

DEPLOYED LINK : https://iridescent-gelato-1c3dfa.netlify.app/ 

## ✨ Features

- **ISS Live Tracking**: Real-time position updates every 15 seconds.
- **Trajectory Visualization**: Interactive Leaflet.js map with path tracking for the last 15 points.
- **Advanced Telemetry**: Live speed calculation using the **Haversine Formula**.
- **Space Intelligence**: News dashboard with search, filtering, and 15-minute localStorage caching.
- **Mission Control AI**: Context-restricted chatbot (Mistral-7B) that only answers based on dashboard telemetry and news data.
- **Futuristic UI**: Premium glassmorphism design with dark/light mode persistence and smooth Framer Motion animations.
- **Data Analytics**: Real-time charts for ISS velocity and news source distribution.

## 🛠 Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS (Custom futuristic theme)
- **Maps**: Leaflet.js + React-Leaflet
- **Charts**: Chart.js + React-Chartjs-2
- **Animations**: Framer Motion
- **AI**: Hugging Face Inference API (Mistral-7B-Instruct-v0.2)
- **API Client**: Axios
- **Icons**: Lucide React

## 🚀 Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_NEWS_API_KEY=your_newsdata_io_key
   VITE_AI_TOKEN=your_huggingface_token
   ```
4. **Run development server**:
   ```bash
   npm run dev
   ```


## 📊 Logic & Math

The ISS speed is calculated in real-time using the **Haversine formula** which determines the great-circle distance between two points on a sphere given their longitudes and latitudes.

---
*Created for the FOAI Endsem Challenge - SpacePulse Intelligence.*
