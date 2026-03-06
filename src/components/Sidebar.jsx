import { Link, useLocation } from 'react-router-dom';
import { Mountain, Bike, Navigation, Map, Compass, HardHat, Footprints, Download, Image as ImageIcon } from 'lucide-react';
import postsData from '../data/posts.json';
import './Sidebar.css';

const categories = [
  { id: 'escursioni', label: 'Escursioni', icon: <Footprints size={18} />, color: 'var(--accent-escursioni)' },
  { id: 'mtb', label: 'MTB', icon: <Bike size={18} />, color: 'var(--accent-mtb)' },
  { id: 'arrampicata', label: 'Arrampicata', icon: <HardHat size={18} />, color: 'var(--accent-arrampicata)' },
  { id: 'scialpinismo', label: 'Scialpinismo', icon: <Mountain size={18} />, color: 'var(--accent-scialpinismo)' }
];

export default function Sidebar() {
  const location = useLocation();
  
  // Check if we are viewing a specific post
  let activePost = null;
  if (location.pathname.startsWith('/post/')) {
    const postId = location.pathname.split('/post/')[1];
    activePost = postsData.find(p => p.id === postId);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo hover-lift">
          <Compass size={28} color="var(--accent-primary)" />
          <span>Le Mie Uscite</span>
        </Link>
      </div>
      
      <div className="sidebar-section">
        <h3 className="section-title">Esplora</h3>
        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Map size={18} /> Tutti i percorsi
          </Link>
          
          {categories.map(cat => (
            <Link 
              key={cat.id}
              to={`/category/${cat.id}`} 
              className={`nav-link ${location.pathname === `/category/${cat.id}` ? 'active' : ''}`}
            >
              <span className="nav-icon" style={{ color: cat.color }}>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </nav>
      </div>

      {activePost && (activePost.gpx || (activePost.photos && activePost.photos.length > 0)) && (
        <div className="sidebar-section fade-in">
          <div className="divider"></div>
          <h3 className="section-title">Allegati</h3>
          <div className="attachments-list">
            
            {activePost.gpx && (
              <a href={activePost.gpx} download className="attachment-btn gpx-btn hover-lift glass">
                <Navigation size={18} />
                <span>Scarica Traccia GPX</span>
              </a>
            )}
            
            {activePost.photos && activePost.photos.length > 0 && (
              <button className="attachment-btn photo-btn hover-lift glass" onClick={() => alert('Gallery functionality coming soon!')}>
                <ImageIcon size={18} />
                <span>Vedi Foto ({activePost.photos.length})</span>
              </button>
            )}

          </div>
        </div>
      )}
      
      <div className="sidebar-footer">
        <p>Gestito tramite Git CMS 🐻</p>
      </div>
    </aside>
  );
}
