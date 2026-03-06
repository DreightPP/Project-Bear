import postsData from '../data/posts.json';
import PostCard from '../components/PostCard';
import './Pages.css';

export default function Home() {
  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>Tutte le Uscite</h1>
        <p className="page-subtitle">I log delle mie avventure in montagna e all'aperto.</p>
      </header>
      
      {postsData.length === 0 ? (
        <div className="empty-state glass-panel">
          <p>Nessun post trovato. Carica qualche file Markdown in public/content/ !</p>
        </div>
      ) : (
        <div className="post-grid">
          {postsData.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
