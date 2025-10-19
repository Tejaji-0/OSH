import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithConfig = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const enableAuth = import.meta.env.VITE_ENABLE_AUTH === 'true';

  // If Auth0 is disabled, just render children
  if (!enableAuth || !domain || !clientId) {
    return <>{children}</>;
  }

  // Build auth params conditionally
  const authParams = {
    redirect_uri: window.location.origin,
    scope: 'openid profile email'
  };
  
  // Only add audience if it's defined (needed for API calls, not basic login)
  if (audience) {
    authParams.audience = audience;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authParams}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithConfig;
