import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './ElevationProfile.css';

export default function ElevationProfile({ elevationData }) {
  if (!elevationData || elevationData.length === 0) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="elevation-tooltip glass">
          <p><strong>{payload[0].value} m</strong></p>
          <p>{payload[0].payload.dist} km</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="elevation-profile-wrapper fade-in">
      <h3 className="elevation-profile-title">Profilo Altimetrico</h3>
      <div className="elevation-chart-container glass-panel">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={elevationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dist"
              tickFormatter={(v) => `${v} km`}
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v} m`}
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={60}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ele"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#elevGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
