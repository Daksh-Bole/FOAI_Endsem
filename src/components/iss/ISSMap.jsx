import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom ISS Icon for premium look
const issIcon = L.divIcon({
  className: 'custom-iss-icon',
  html: `
    <div class="relative">
      <div class="absolute -inset-4 bg-cyan-400/20 rounded-full animate-ping"></div>
      <div class="relative w-10 h-10 bg-slate-900 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-cyan-400 fill-current">
          <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
        </svg>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const MapAutoCenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), {
      animate: true,
      duration: 1.5,
    });
  }, [lat, lng, map]);
  return null;
};

const ISSMap = ({ lat, lng, trajectory }) => {
  // Step 5 Implementation
  return (
    <div className="w-full h-[500px] glass-card overflow-hidden border border-slate-700/50 shadow-2xl relative">
      <div className="absolute top-4 right-4 z-[1000] bg-space-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-400/30 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
        Telemetry Stream: ACTIVE
      </div>
      
      <MapContainer 
        center={[lat, lng]} 
        zoom={3} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Step 5 - Marker */}
        <Marker 
          position={[lat, lng]} 
          icon={issIcon}
        >
          <Popup>
            <div className="text-slate-800 font-bold p-1">
              ISS Current Position<br/>
              Lat: {lat.toFixed(4)}<br/>
              Lng: {lng.toFixed(4)}
            </div>
          </Popup>
        </Marker>

        {/* Step 5 - Polyline */}
        <Polyline 
          positions={trajectory.map((p) => [p.lat, p.lng])} 
          color="cyan"
          weight={4}
          opacity={0.8}
          dashArray="10, 10"
        />

        <MapAutoCenter lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
};

export default ISSMap;
