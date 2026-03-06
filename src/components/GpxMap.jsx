import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import './GpxMap.css';

export default function GpxMap({ gpxUrl }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Make sure we only execute on the client side
    if (!mapRef.current || !gpxUrl || typeof window === 'undefined') return;

    if (!mapInstance.current) {
      // Initialize map once
      mapInstance.current = L.map(mapRef.current);
      
      // Use standard OSM map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    } else {
      // Clear previous layers
      mapInstance.current.eachLayer((layer) => {
        if (!layer._url) { // keep the tileLayer
          mapInstance.current.removeLayer(layer);
        }
      });
    }

    // Leaflet GPX specific config to handle markers from cdnjs since they are not bundled by default
    const gpxLayer = new L.GPX(gpxUrl, {
      async: true,
      marker_options: {
        startIconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/pin-icon-start.png',
        endIconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/pin-icon-end.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/pin-shadow.png'
      },
      polyline_options: {
        color: '#3b82f6', // Tailwind blue-500 equivalent matches our accent
        opacity: 0.9,
        weight: 5,
        lineCap: 'round'
      }
    }).on('loaded', function(e) {
      // Focus map to GPX extent
      mapInstance.current.fitBounds(e.target.getBounds());
    }).addTo(mapInstance.current);

    return () => {
      // Clean up layer on unmount or URL change
      if (mapInstance.current && mapInstance.current.hasLayer(gpxLayer)) {
        mapInstance.current.removeLayer(gpxLayer);
      }
    };
  }, [gpxUrl]);

  return (
    <div className="gpx-map-wrapper fade-in">
      <h3 className="gpx-map-title">Mappa del Percorso</h3>
      <div className="gpx-map-container glass-panel" ref={mapRef}></div>
    </div>
  );
}
