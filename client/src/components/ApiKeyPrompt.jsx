import { useState } from 'react';
import './ApiKeyPrompt.css';

function ApiKeyPrompt({ onSave, onClose, currentKey }) {
  const [key, setKey] = useState(currentKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🔑 API Key Setup</h2>
        <p className="modal-desc">
          Enter your Google Gemini API key to start chatting with ClearMind.
        </p>
        <p className="modal-info">
          Get your free API key at: <br />
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="api-link"
          >
            https://aistudio.google.com/app/apikey
          </a>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="api-input"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="toggle-visibility"
            >
              {showKey ? '👁️' : '🔒'}
            </button>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={!key.trim()}>
              Save & Continue
            </button>
            {currentKey && (
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
        <div className="privacy-note">
          🔐 Your API key is stored locally in your browser and never sent to any server.
        </div>
      </div>
    </div>
  );
}

export default ApiKeyPrompt;
