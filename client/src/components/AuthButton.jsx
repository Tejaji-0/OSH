import { useAuth0 } from '@auth0/auth0-react';
import './AuthButton.css';

function AuthButton() {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const enableAuth = import.meta.env.VITE_ENABLE_AUTH === 'true';

  // Don't show auth button if disabled
  if (!enableAuth) {
    return null;
  }

  if (isLoading) {
    return (
      <button className="auth-btn loading" disabled>
        Loading...
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="user-info">
          {user?.picture && (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="user-avatar"
            />
          )}
          <span className="user-name">{user?.name || user?.email}</span>
        </div>
        <button 
          className="auth-btn logout-btn"
          onClick={() => logout({ 
            logoutParams: { returnTo: window.location.origin }
          })}
        >
          🚪 Logout
        </button>
      </div>
    );
  }

  return (
    <button 
      className="auth-btn login-btn"
      onClick={() => loginWithRedirect()}
    >
      🔐 Login with Auth0
    </button>
  );
}

export default AuthButton;
