import { useState } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar glass">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        placeholder="Cerca un'uscita..."
        value={query}
        onChange={handleChange}
        className="search-input"
        id="search-input"
      />
      {query && (
        <button className="search-clear" onClick={handleClear} aria-label="Cancella ricerca">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
