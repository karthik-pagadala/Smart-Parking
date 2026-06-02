import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FixMapResize = () => {
  const map = useMap();

  useEffect(() => {
    // Invalidate size initially after a short delay to ensure container is fully rendered
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Also invalidate size on window resize
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
};

export default FixMapResize;
