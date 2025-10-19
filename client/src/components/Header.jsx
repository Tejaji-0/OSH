import './Header.css';

function Header({ mood, onStatsClick, conversationCount }) {
  const moodClass = `mood-${(mood || 'neutral').toLowerCase()}`;

  return (
    <header className="header container">
      <div className="header-left">
        <h1>ClearMind 🧠</h1>
        <span className="tagline">Powered by Google Gemini 2.0</span>
      </div>
      <div className="toolbar">
        <span className={`badge ${moodClass}`}>
          {getMoodEmoji(mood)} {mood || 'neutral'}
        </span>
        <button 
          className="stats-btn" 
          onClick={onStatsClick}
          title="View Analytics"
        >
          📊 Stats
        </button>
      </div>
    </header>
  );
}

function getMoodEmoji(mood) {
  const emojis = {
    happy: '😊',
    calm: '😌',
    anxious: '😰',
    stressed: '😫',
    sad: '😢',
    neutral: '😐'
  };
  return emojis[mood] || '😐';
}

export default Header;
