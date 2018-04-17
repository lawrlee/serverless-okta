const config = {
  oidc: {
    issuer: process.env.REACT_APP_OKTA_ISSUER,
    redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI,
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
    scope: process.env.REACT_APP_OKTA_SCOPE,
  },
  resourceServer: {
    apiUrl: process.env.REACT_APP_RESOURCE_API_URL
  },
};

export default config