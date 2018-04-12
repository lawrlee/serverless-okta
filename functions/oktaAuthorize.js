const JwtTokenHandler = require('oauth2-bearer-jwt-handler').JwtTokenHandler;
const jwt = require('jsonwebtoken');
const jwtParams = {
  issuer: process.env.ISSUER,
  audience: process.env.AUDIENCE,
  jwks: process.env.JWKS
};
console.log("Environment variables");
console.log(process.env);
console.log(jwtParams);
const jwtTokenHandler = new JwtTokenHandler(jwtParams);

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
  console.log('Event received');
  console.log(event);
  console.log('Context received');
  console.log(context);
  console.log('token');
  console.log(jwt.decode(event.authorizationToken.replace('Bearer ', '')));

  jwtTokenHandler.verifyRequest({
    headers: {
      authorization: event.authorizationToken
    }
  }, function (err, claims) {
    if (err) {
      console.log('Failed to validate bearer token', err);
      callback('Unauthorized');
    } else {
      console.log('request principal: ', claims);
      const policyDocument = buildPolicy(
        claims.sub,
        event.methodArn,
        {user: claims.uid}
      );
      callback(null, policyDocument);
    }
  });

};