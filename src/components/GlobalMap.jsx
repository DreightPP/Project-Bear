import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './GlobalMap.css';

const CAT_COLORS = {
  escursioni: '#22c55e',
  mtb: '#eab308',
  arrampicata: '#ef4444',
  scialpinismo: '#06b6d4',
};

function createCategoryIcon(category) {
  const color = CAT_COLORS[category] || '#3b82f6';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 14px; height: 14px; border-radius: 50%;
      background: ${color};
      border: 3px solid rgba(255,255,255,0.9);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

export default function GlobalMap({ posts }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current) return;

    const geoItems = posts.filter(
      (p) => p.gpxStats && p.gpxStats.startLat && p.gpxStats.startLon
    );

    if (geoItems.length === 0) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        scrollWheelZoom: false,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);
    }

    const bounds = [];

    geoItems.forEach((post) => {
      const { startLat, startLon } = post.gpxStats;
      bounds.push([startLat, startLon]);

      const marker = L.marker([startLat, startLon], {
        icon: createCategoryIcon(post.category),
      }).addTo(mapInstance.current);

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;font-size:13px;">
          <strong>${post.title}</strong><br/>
          <span style="color:#94a3b8;font-size:11px;">${post.category.toUpperCase()} · ${post.gpxStats.distance} km</span>
        </div>`
      );

      marker.on('click', () => {
        marker.openPopup();
      });

      marker.on('popupopen', () => {
        const popup = marker.getPopup();
        const el = popup.getElement();
        if (el) {
          el.style.cursor = 'pointer';
          el.onclick = () => navigate(`/post/${post.id}`);
        }
      });
    });

    if (bounds.length > 0) {
      mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [posts, navigate]);

  const hasGeo = posts.some(
    (p) => p.gpxStats && p.gpxStats.startLat && p.gpxStats.startLon
  );

  if (!hasGeo) return null;

  return (
    <div className="global-map-wrapper fade-in">
      <h2 className="global-map-title">Le Mie Avventure</h2>
      <div className="global-map-container glass-panel" ref={mapRef}></div>
    </div>
  );
}
