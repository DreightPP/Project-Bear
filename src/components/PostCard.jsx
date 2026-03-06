import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import './PostCard.css';

export default function PostCard({ post }) {
  // Format logical date
  const dateFormatted = new Date(post.date).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Link to={`/post/${post.id}`} className="post-card hover-lift glass-panel">
      <div className="post-card-header">
        <span className={`post-category tag-${post.category}`}>
          {post.category.toUpperCase()}
        </span>
        <div className="post-date">
          <Calendar size={14} />
          {dateFormatted}
        </div>
      </div>
      
      <h2 className="post-title">{post.title}</h2>
      
      <p className="post-excerpt">
        {post.excerpt || "Nessun estratto disponibile. Clicca per leggere il report completo dell'uscita."}
      </p>

      <div className="post-card-footer">
        <span className="read-more">Leggi tutto →</span>
        {post.gpx && (
          <span className="has-gpx" title="Traccia GPX Disponibile">GPX</span>
        )}
      </div>
    </Link>
  );
}
