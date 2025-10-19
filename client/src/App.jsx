import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Header from './components/Header';
import Chat from './components/Chat';
import InputBox from './components/InputBox';
import TherapyMode from './components/TherapyMode';
import MindfulnessTools from './components/MindfulnessTools';
import ResourceFinder from './components/ResourceFinder';
import EmotionMap from './components/EmotionMap';
import AuthButton from './components/AuthButton';
import SnowflakeExport from './components/SnowflakeExport';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const enableAuth = import.meta.env.VITE_ENABLE_AUTH === 'true';
  const [showApp, setShowApp] = useState(false);
  
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi, I\'m ClearMind 🧠. I\'m your AI mental health companion powered by Google Gemini. How are you feeling today?' }
  ]);
  const [mood, setMood] = useState('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState('AIzaSyAH__KtMncZEOhQgz2OLR9Ce8X0JYAqRBI');
  const [selectedModel] = useState('models/gemini-2.0-flash-exp');
  const [moodHistory, setMoodHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [insights, setInsights] = useState('');
  const [showTherapy, setShowTherapy] = useState(false);
  const [showMindfulness, setShowMindfulness] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showEmotionMap, setShowEmotionMap] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [showCheckInPrompt, setShowCheckInPrompt] = useState(false);

  // Auto-enter app if auth is disabled or user is authenticated
  useEffect(() => {
    if (!enableAuth || (enableAuth && isAuthenticated)) {
      setShowApp(true);
    }
  }, [enableAuth, isAuthenticated]);

  const handleEnterApp = () => {
    setShowApp(true);
  };

  const detectMood = (text) => {
    const lowerText = text.toLowerCase();
    if (/(happy|joy|excited|great|awesome|wonderful|love|amazing)/i.test(lowerText)) return 'happy';
    if (/(calm|peaceful|relax|serene|content|fine)/i.test(lowerText)) return 'calm';
    if (/(anxious|nervous|worried|scared|afraid|panic)/i.test(lowerText)) return 'anxious';
    if (/(stress|overwhelm|pressure|busy|exhausted|tired)/i.test(lowerText)) return 'stressed';
    if (/(sad|depressed|down|upset|lonely|cry)/i.test(lowerText)) return 'sad';
    return 'neutral';
  };

  // Daily check-in notification system
  useEffect(() => {
    const checkForCheckIn = () => {
      const now = new Date();
      const morning = new Date();
      morning.setHours(9, 0, 0, 0);
      const evening = new Date();
      evening.setHours(20, 0, 0, 0);

      // Show check-in prompt if it's morning or evening and hasn't been shown today
      const lastCheckInDate = lastCheckIn ? new Date(lastCheckIn).toDateString() : null;
      const todayDate = now.toDateString();

      if (lastCheckInDate !== todayDate) {
        if ((now.getHours() === 9 || now.getHours() === 20) && !showCheckInPrompt) {
          setShowCheckInPrompt(true);
          setLastCheckIn(now.toISOString());
        }
      }
    };

    const interval = setInterval(checkForCheckIn, 60000); // Check every minute
    checkForCheckIn(); // Initial check

    return () => clearInterval(interval);
  }, [lastCheckIn, showCheckInPrompt]);

  const generateInsights = async () => {
    if (moodHistory.length < 3) return;
    
    const moodSummary = moodHistory.slice(-10).map(m => m.mood).join(', ');
    const insightPrompt = `Based on these recent moods: ${moodSummary}
    
Provide a brief, supportive insight (1-2 sentences) about the emotional pattern and a helpful tip.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: insightPrompt }] }]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        setInsights(text);
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  const callGeminiAPI = async (userMessage) => {
    if (!selectedModel) {
      throw new Error('Please select a model first');
    }
    
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`;
    
    const contextHistory = messages.slice(-4).map(m => `${m.role}: ${m.text}`).join('\n');
    
    const prompt = `You are ClearMind, an empathetic AI mental health companion powered by Google Gemini 2.0. 

Recent context:
${contextHistory}

User just said: "${userMessage}"

Respond with warmth, empathy, and professional support. Be conversational, caring, and provide actionable advice when appropriate. Keep responses concise (2-4 sentences).

Important: Detect the emotional state accurately and provide appropriate support.

Respond ONLY with valid JSON in this exact format:
{"mood": "happy|calm|anxious|stressed|sad|neutral", "reply": "your empathetic response here", "suggestion": "optional brief wellness tip"}`;

    console.log('Calling Gemini API...');
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error Response:', error);
      throw new Error(`Gemini API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Extracted text:', text);
    
    // Try to extract JSON from the response - handle multiline JSON
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Parsed JSON:', parsed);
        return parsed;
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }
    
    // Fallback if JSON parsing fails
    const fallback = {
      mood: detectMood(userMessage),
      reply: text.trim() || 'I\'m here to listen. Tell me more about how you\'re feeling.',
      suggestion: null
    };
    console.log('Using fallback:', fallback);
    return fallback;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'me', text }]);
    setIsLoading(true);

    // Add thinking placeholder
    setMessages(prev => [...prev, { role: 'ai', text: '💭 thinking...' }]);

    try {
      const data = await callGeminiAPI(text);

      // Replace thinking message with actual response
      let responseText = data.reply || 'I\'m here with you.';
      if (data.suggestion) {
        responseText += `\n\n💡 Tip: ${data.suggestion}`;
      }
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'ai',
          text: responseText
        };
        return newMessages;
      });

      const detectedMood = data.mood || 'neutral';
      setMood(detectedMood);
      
      // Track mood history for analytics
      setMoodHistory(prev => [...prev, { 
        mood: detectedMood, 
        timestamp: new Date().toISOString(),
        message: text.substring(0, 50)
      }]);
      
      setConversationCount(prev => prev + 1);
      
      // Generate insights every 5 conversations
      if ((conversationCount + 1) % 5 === 0) {
        setTimeout(() => generateInsights(), 1000);
      }
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      let errorMsg = '❌ Sorry, something went wrong. ';
      if (error.message.includes('Failed to fetch')) {
        errorMsg += 'Network error - check your internet connection.';
      } else if (error.message.includes('403')) {
        errorMsg += 'API key may be invalid or restricted.';
      } else if (error.message.includes('429')) {
        errorMsg += 'Rate limit exceeded. Please wait a moment.';
      } else {
        errorMsg += error.message;
      }
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'ai',
          text: errorMsg
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Header 
        mood={mood} 
        onStatsClick={() => setShowStats(!showStats)}
        conversationCount={conversationCount}
      />

      {/* Floating Action Menu */}
      <div className="floating-menu">
        <button 
          className="menu-btn therapy-btn"
          onClick={() => setShowTherapy(true)}
          title="Start Therapy Mode"
        >
          🧘 Therapy
        </button>
        <button 
          className="menu-btn mindfulness-btn"
          onClick={() => setShowMindfulness(true)}
          title="Mindfulness Tools"
        >
          🌊 Mindfulness
        </button>
        <button 
          className="menu-btn resources-btn"
          onClick={() => setShowResources(true)}
          title="Find Resources"
        >
          🌐 Resources
        </button>
        <button 
          className="menu-btn emotion-map-btn"
          onClick={() => setShowEmotionMap(true)}
          title="Emotion Map"
        >
          📊 Emotion Map
        </button>
      </div>

      {/* Check-in Notification */}
      {showCheckInPrompt && (
        <div className="checkin-notification">
          <div className="checkin-content">
            <h4>
              {new Date().getHours() < 12 ? '☀️ Good Morning!' : '🌙 Good Evening!'}
            </h4>
            <p>
              {new Date().getHours() < 12 
                ? 'How are you feeling today? Take 2 minutes to journal.' 
                : 'How was your day? Let\'s reflect together.'}
            </p>
            <div className="checkin-actions">
              <button onClick={() => {
                setShowCheckInPrompt(false);
                setShowTherapy(true);
              }}>
                Start Check-In
              </button>
              <button onClick={() => setShowCheckInPrompt(false)} className="dismiss-btn">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TherapyMode 
        isOpen={showTherapy}
        onClose={() => setShowTherapy(false)}
        onSendMessage={sendMessage}
      />
      
      <MindfulnessTools 
        isOpen={showMindfulness}
        onClose={() => setShowMindfulness(false)}
      />
      
      <ResourceFinder 
        isOpen={showResources}
        onClose={() => setShowResources(false)}
      />
      
      <EmotionMap 
        isOpen={showEmotionMap}
        onClose={() => setShowEmotionMap(false)}
        moodHistory={moodHistory}
      />
      
      {/* Show Landing Page or Main App */}
      {!showApp ? (
        <LandingPage onEnter={handleEnterApp} />
      ) : (
        <>
          <main className="container">
            <div className="card">
              <Chat messages={messages} />
              <InputBox onSend={sendMessage} disabled={isLoading} />
            </div>
          </main>
          
          {conversationCount > 0 && (
            <div className="floating-badge">
              💬 {conversationCount} conversation{conversationCount !== 1 ? 's' : ''}
            </div>
          )}
          
          {showStats && (
            <div className="stats-panel">
              <div className="stats-header">
                <h3>📊 Your Mental Health Journey</h3>
                <button className="close-btn" onClick={() => setShowStats(false)}>×</button>
              </div>
              
              <div className="auth-section">
                <AuthButton />
              </div>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{conversationCount}</div>
                  <div className="stat-label">Conversations</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{moodHistory.length}</div>
                  <div className="stat-label">Mood Entries</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">
                    {moodHistory.length > 0 
                      ? moodHistory[moodHistory.length - 1].mood 
                      : 'neutral'}
                  </div>
                  <div className="stat-label">Current Mood</div>
                </div>
              </div>
              
              {moodHistory.length > 0 && (
                <div className="mood-timeline">
                  <h4>Recent Mood Pattern</h4>
                  <div className="mood-dots">
                    {moodHistory.slice(-10).map((entry, i) => (
                      <div 
                        key={i}
                        className={`mood-dot mood-${entry.mood}`}
                        title={`${entry.mood} - ${new Date(entry.timestamp).toLocaleTimeString()}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {insights && (
                <div className="insights-card">
                  <h4>🔍 AI Insights</h4>
                  <p>{insights}</p>
                </div>
              )}
              
              <SnowflakeExport 
                moodHistory={moodHistory}
                conversations={messages}
              />
              
              <div className="privacy-note">
                <small>🔒 All data is stored locally in your browser. Nothing is sent to external servers except Gemini API calls.</small>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
