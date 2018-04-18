const jwt = require('jsonwebtoken');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.ISSUER,
  assertClaims: {
    aud: process.env.AUDIENCE,
    cid: process.env.CID
  }
});

const buildPolicy = (user, resource, context) => {
  return {
    principalId: user,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: resource
        }
      ]
    },
    context: context
  }
};

module.exports.handler = (event, context, callback) => {
  const accessToken = event.authorizationToken.replace('Bearer ', '');
  console.log(jwt.decode(accessToken));

  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      console.log('Authorized: ', jwt);
      const policyDocument = buildPolicy(
        jwt.claims.sub,
        event.methodArn,
        {user: jwt.claims.uid}
      );
      callback(null, policyDocument);
    })
    .catch(err => {
      console.log('Failed to validate bearer token ', err);
      callback('Unauthorized')
    });

};