import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mountain, Bike, Navigation, Map, Compass, HardHat, Footprints, Search } from 'lucide-react';
import postsData from '../data/posts.json';
import SearchBar from './SearchBar';
import './Sidebar.css';

const categories = [
  { id: 'escursioni', label: 'Escursioni', icon: <Footprints size={18} />, color: 'var(--accent-escursioni)' },
  { id: 'mtb', label: 'MTB', icon: <Bike size={18} />, color: 'var(--accent-mtb)' },
  { id: 'arrampicata', label: 'Arrampicata', icon: <HardHat size={18} />, color: 'var(--accent-arrampicata)' },
  { id: 'scialpinismo', label: 'Scialpinismo', icon: <Mountain size={18} />, color: 'var(--accent-scialpinismo)' }
];

export default function Sidebar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check if we are viewing a specific post
  let activePost = null;
  if (location.pathname.startsWith('/post/')) {
    const postId = location.pathname.split('/post/')[1];
    activePost = postsData.find(p => p.id === postId);
  }

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return postsData.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo hover-lift">
          <Compass size={28} color="var(--accent-primary)" />
          <span>Orsolando</span>
        </Link>
      </div>
      
      <SearchBar onSearch={setSearchQuery} />

      {/* Search results overlay */}
      {searchQuery.trim() && (
        <div className="sidebar-section search-results fade-in">
          <h3 className="section-title">Risultati ({filteredPosts.length})</h3>
          {filteredPosts.length === 0 ? (
            <p className="no-results">Nessun risultato per "{searchQuery}"</p>
          ) : (
            <div className="search-results-list">
              {filteredPosts.map(post => (
                <Link key={post.id} to={`/post/${post.id}`} className="search-result-item hover-lift">
                  <span className={`search-result-tag tag-${post.category}`}>{post.category}</span>
                  <span className="search-result-title">{post.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {!searchQuery.trim() && (
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
      )}

      {activePost && activePost.gpx && (
        <div className="sidebar-section fade-in">
          <div className="divider"></div>
          <h3 className="section-title">Allegati</h3>
          <div className="attachments-list">
            <a href={activePost.gpx} download className="attachment-btn gpx-btn hover-lift glass">
              <Navigation size={18} />
              <span>Scarica Traccia GPX</span>
            </a>
          </div>
        </div>
      )}
      
      <div className="sidebar-footer">
        <p>Gestito tramite Git CMS 🐻</p>
      </div>
    </aside>
  );
}
