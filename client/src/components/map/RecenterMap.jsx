import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const RecenterMap = ({ center, zoom = 13 }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [center, map, zoom]);

  return null;
};

export default RecenterMap;
