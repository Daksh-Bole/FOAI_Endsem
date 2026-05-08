import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSLocation, fetchAstronauts, reverseGeocode } from '../services/issService';
import { calculateSpeed } from '../utils/haversine';
import toast from 'react-hot-toast';

export const useISSData = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0, timestamp: Date.now() });
  const [previousPosition, setPreviousPosition] = useState(null);
  const [trackedPositions, setTrackedPositions] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [astronauts, setAstronauts] = useState([]);
  const [astronautCount, setAstronautCount] = useState(0);
  const [locationName, setLocationName] = useState('Synchronizing...');
  const [isSimulated, setIsSimulated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchISSLocation();
      setIsSimulated(data.isSimulated);

      const newPosition = {
        lat: data.lat,
        lng: data.lng,
        timestamp: Date.now(),
      };

      setCurrentPosition(newPosition);

      setTrackedPositions((prev) => {
        const updated = [...prev, newPosition];
        return updated.slice(-15);
      });

      if (previousPosition) {
        const calculatedSpeed = calculateSpeed(
          previousPosition,
          newPosition,
          15
        );
        const finalSpeed = (calculatedSpeed > 30000 || calculatedSpeed < 20000) ? 27600 : calculatedSpeed;
        setSpeed(finalSpeed);
        setSpeedHistory((prev) => [
          ...prev,
          { time: new Date().toLocaleTimeString(), speed: finalSpeed },
        ].slice(-30));
      } else {
        setSpeed(27600);
      }

      setPreviousPosition(newPosition);
      const loc = await reverseGeocode(newPosition.lat, newPosition.lng);
      setLocationName(loc);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Telemetry data failure", err);
    }
  }, [previousPosition]);

  const fetchAstroData = useCallback(async () => {
    try {
      const astroData = await fetchAstronauts();
      setAstronauts(astroData.people);
      setAstronautCount(astroData.number);
    } catch (err) {
      console.error("Astro fetch failed", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchAstroData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData, fetchAstroData]);

  return {
    lat: currentPosition.lat,
    lng: currentPosition.lng,
    speed,
    locationName,
    timestamp: currentPosition.timestamp / 1000,
    trajectory: trackedPositions,
    allPositions: trackedPositions,
    speedHistory,
    peopleCount: astronautCount,
    peopleList: astronauts,
    isSimulated,
    loading,
    error,
    refresh: fetchData
  };
};
