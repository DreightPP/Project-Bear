import { Mountain, Route, TrendingUp, TrendingDown } from 'lucide-react';
import './GpxStatsBar.css';

export default function GpxStatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="gpx-stats-bar fade-in">
      <div className="stat-item glass">
        <Route size={20} className="stat-icon distance-icon" />
        <div>
          <span className="stat-value">{stats.distance} km</span>
          <span className="stat-label">Distanza</span>
        </div>
      </div>
      <div className="stat-item glass">
        <TrendingUp size={20} className="stat-icon gain-icon" />
        <div>
          <span className="stat-value">+{stats.elevGain} m</span>
          <span className="stat-label">Dislivello +</span>
        </div>
      </div>
      <div className="stat-item glass">
        <TrendingDown size={20} className="stat-icon loss-icon" />
        <div>
          <span className="stat-value">-{stats.elevLoss} m</span>
          <span className="stat-label">Dislivello -</span>
        </div>
      </div>
      <div className="stat-item glass">
        <Mountain size={20} className="stat-icon peak-icon" />
        <div>
          <span className="stat-value">{stats.eleMax} m</span>
          <span className="stat-label">Quota Max</span>
        </div>
      </div>
    </div>
  );
}
