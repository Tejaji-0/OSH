import { useEffect } from 'react';
import './EmotionMap.css';

function EmotionMap({ isOpen, onClose, moodHistory }) {
  // Group moods by date
  const getMoodsByDate = () => {
    const grouped = {};
    moodHistory.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });
    return grouped;
  };

  // Calculate mood intensity (0-100)
  const getMoodIntensity = (mood) => {
    const intensityMap = {
      happy: 100,
      calm: 70,
      neutral: 50,
      anxious: 30,
      stressed: 20,
      sad: 10
    };
    return intensityMap[mood] || 50;
  };

  // Get color for mood
  const getMoodColor = (mood) => {
    const colorMap = {
      happy: '#22c55e',
      calm: '#3b82f6',
      neutral: '#94a3b8',
      anxious: '#fbbf24',
      stressed: '#f97316',
      sad: '#ef4444'
    };
    return colorMap[mood] || '#94a3b8';
  };

  // Calculate average mood for a date
  const getAverageMood = (moods) => {
    const total = moods.reduce((sum, m) => sum + getMoodIntensity(m.mood), 0);
    return Math.round(total / moods.length);
  };

  const moodsByDate = getMoodsByDate();
  const dates = Object.keys(moodsByDate).sort((a, b) => new Date(a) - new Date(b));
  
  // Get last 7 days for timeline
  const last7Days = dates.slice(-7);

  // Calculate mood distribution
  const getMoodDistribution = () => {
    const distribution = {
      happy: 0,
      calm: 0,
      neutral: 0,
      anxious: 0,
      stressed: 0,
      sad: 0
    };
    
    moodHistory.forEach(entry => {
      if (distribution[entry.mood] !== undefined) {
        distribution[entry.mood]++;
      }
    });

    return distribution;
  };

  const distribution = getMoodDistribution();
  const total = moodHistory.length;

  if (!isOpen) return null;

  return (
    <div className="emotion-map-overlay">
      <div className="emotion-map-container">
        <div className="emotion-map-header">
          <h2>📊 Emotion Map</h2>
          <p>Visualize your emotional journey</p>
          <button className="close-emotion-map" onClick={onClose}>✕</button>
        </div>

        {moodHistory.length === 0 ? (
          <div className="no-data">
            <p>Start chatting to see your emotion map! 💬</p>
          </div>
        ) : (
          <>
            {/* Timeline Heatmap */}
            <div className="timeline-section">
              <h3>📅 7-Day Mood Timeline</h3>
              <div className="timeline-grid">
                {last7Days.length > 0 ? (
                  last7Days.map((date, idx) => {
                    const moods = moodsByDate[date];
                    const avgIntensity = getAverageMood(moods);
                    const dominantMood = moods[moods.length - 1].mood;
                    
                    return (
                      <div key={idx} className="timeline-day">
                        <div className="day-label">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div 
                          className="day-bar"
                          style={{
                            height: `${avgIntensity}%`,
                            background: `linear-gradient(to top, ${getMoodColor(dominantMood)}, ${getMoodColor(dominantMood)}aa)`
                          }}
                          title={`${moods.length} entries`}
                        >
                          <span className="bar-value">{moods.length}</span>
                        </div>
                        <div className="day-date">{new Date(date).getDate()}</div>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-timeline">Not enough data yet</p>
                )}
              </div>
            </div>

            {/* Mood Distribution Pie Chart */}
            <div className="distribution-section">
              <h3>🎨 Mood Distribution</h3>
              <div className="mood-circles">
                {Object.entries(distribution).map(([mood, count]) => {
                  if (count === 0) return null;
                  const percentage = ((count / total) * 100).toFixed(1);
                  
                  return (
                    <div key={mood} className="mood-circle-item">
                      <div 
                        className="mood-circle"
                        style={{
                          width: `${Math.max(60, percentage * 2)}px`,
                          height: `${Math.max(60, percentage * 2)}px`,
                          background: getMoodColor(mood)
                        }}
                      >
                        <span className="circle-percentage">{percentage}%</span>
                      </div>
                      <div className="mood-label">{mood}</div>
                      <div className="mood-count">{count} times</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Patterns */}
            <div className="patterns-section">
              <h3>🔍 Recent Patterns</h3>
              <div className="pattern-list">
                {moodHistory.slice(-5).reverse().map((entry, idx) => (
                  <div key={idx} className="pattern-item">
                    <div 
                      className="pattern-dot"
                      style={{ background: getMoodColor(entry.mood) }}
                    />
                    <div className="pattern-details">
                      <div className="pattern-mood">{entry.mood}</div>
                      <div className="pattern-time">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      {entry.message && (
                        <div className="pattern-message">{entry.message}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights Summary */}
            <div className="map-insights">
              <h3>💡 Quick Insights</h3>
              <div className="insight-cards">
                <div className="insight-card">
                  <div className="insight-icon">📈</div>
                  <div className="insight-text">
                    <strong>Total Entries:</strong> {total}
                  </div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-text">
                    <strong>Most Common:</strong> {Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0]}
                  </div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">⏱️</div>
                  <div className="insight-text">
                    <strong>Tracking Since:</strong> {new Date(moodHistory[0].timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmotionMap;
