import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import postsData from '../data/posts.json';
import GpxMap from '../components/GpxMap';
import GpxStatsBar from '../components/GpxStatsBar';
import ElevationProfile from '../components/ElevationProfile';
import './Pages.css';

export default function Post() {
  const { postId } = useParams();
  const post = postsData.find(p => p.id === postId);
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post) {
      setLoading(true);
      fetch(post.path)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load markdown');
          return res.text();
        })
        .then(text => {
          // Strip the gray matter frontmatter
          const contentWithoutMatter = text.replace(/^---[\s\S]*?---/, '');
          setContent(contentWithoutMatter);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setContent('Errore caricamento report.');
          setLoading(false);
        });
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const dateFormatted = new Date(post.date).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="page-container post-view fade-in">
      <header className="post-main-header">
        <div className="post-meta">
          <span className={`post-category tag-${post.category}`}>
            {post.category.toUpperCase()}
          </span>
          <span className="post-date-large">{dateFormatted}</span>
        </div>
        <h1 className="post-main-title">{post.title}</h1>
      </header>

      {post.gpxStats && <GpxStatsBar stats={post.gpxStats} />}

      <article className="markdown-content glass-panel" style={{ padding: '2.5rem' }}>
        {loading ? (
          <div className="loading-state">Caricamento report...</div>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
      </article>

      {post.gpx && <GpxMap gpxUrl={post.gpx} />}

      {post.gpxStats && post.gpxStats.elevationProfile && (
        <ElevationProfile elevationData={post.gpxStats.elevationProfile} />
      )}
    </div>
  );
}
