import { useParams } from 'react-router-dom';
import postsData from '../data/posts.json';
import PostCard from '../components/PostCard';
import './Pages.css';

const CAT_LABELS = {
  escursioni: 'Escursioni',
  mtb: 'Mountain Bike',
  arrampicata: 'Arrampicata',
  scialpinismo: 'Scialpinismo'
};

export default function Category() {
  const { categoryId } = useParams();
  const categoryPosts = postsData.filter(p => p.category === categoryId);
  
  const label = CAT_LABELS[categoryId] || categoryId.toUpperCase();

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>{label}</h1>
        <p className="page-subtitle">Esplora tutte le uscite della categoria {label.toLowerCase()}.</p>
      </header>
      
      {categoryPosts.length === 0 ? (
        <div className="empty-state glass-panel">
          <p>Nessuna uscita registrata per questa categoria.</p>
        </div>
      ) : (
        <div className="post-grid">
          {categoryPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
