import { useAuth0 } from '@auth0/auth0-react';
import './LandingPage.css';

function LandingPage({ onEnter }) {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const enableAuth = import.meta.env.VITE_ENABLE_AUTH === 'true';

  const handleGetStarted = () => {
    if (enableAuth && !isAuthenticated) {
      // Automatically login with Auth0
      loginWithRedirect();
    } else {
      // Enter app directly (anonymous mode or already logged in)
      onEnter();
    }
  };

  if (isLoading) {
    return (
      <div className="landing-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="landing-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-icon">🧠</div>
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">ClearMind</span>
          </h1>
          <p className="hero-subtitle">
            Your AI-powered mental health companion, available 24/7
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Empathetic AI Chat</h3>
            <p>Talk to our AI companion powered by Google Gemini</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Mood Tracking</h3>
            <p>Automatic emotion detection and insights</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🧘</div>
            <h3>Mindfulness Tools</h3>
            <p>Breathing exercises and guided therapy</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>100% Private</h3>
            <p>Your conversations stay on your device</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <button className="cta-button" onClick={handleGetStarted}>
            {enableAuth && !isAuthenticated ? (
              <>
                <span>🔐</span>
                <span>Login & Get Started</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Get Started Free</span>
              </>
            )}
          </button>
          
          <p className="cta-subtext">
            No credit card required • Free forever • Open Source
          </p>
        </div>

        {/* Trust Badges */}
        <div className="trust-section">
          <div className="trust-badge">
            <span className="badge-icon">⚡</span>
            <span className="badge-text">Powered by Gemini AI</span>
          </div>
          <div className="trust-badge">
            <span className="badge-icon">🔐</span>
            <span className="badge-text">Auth0 Secured</span>
          </div>
          <div className="trust-badge">
            <span className="badge-icon">🌟</span>
            <span className="badge-text">Free & Open Source</span>
          </div>
        </div>

        {/* Footer */}
        <div className="landing-footer">
          <p>
            Made with ❤️ for mental health awareness
          </p>
          <p className="footer-links">
            <a href="https://github.com/Tejaji-0/OSH" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {' • '}
            <span>Open Source (MIT)</span>
            {' • '}
            <span>Crisis? Call 988</span>
          </p>
        </div>
      </div>

      {/* Animated Background */}
      <div className="animated-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
}

export default LandingPage;
