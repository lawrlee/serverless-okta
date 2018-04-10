const JwtTokenHandler = require('oauth2-bearer-jwt-handler').JwtTokenHandler;
const fs = require('fs');
// const jwtDecode = require('jwt-decode');
const jwtParams = {
  issuer: process.env.ISSUER,
  audience: process.env.AUDIENCE,
  jwks: fs.readFileSync('keys.json', 'utf8'),
};

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
}

module.exports.handler = (event, context, callback) => {
  console.log('Event received');
  console.log(event);
  console.log('Context received');
  console.log(context);

  jwtTokenHandler.verifyRequest({
    headers: {
      authorization: event.authorizationToken
    }
  }, function (err, claims) {
    if (err) {
      console.log('Failed to validate bearer token', err);
      callback('Unauthorized');
    }

    console.log('request principal: ', claims);
    const policyDocument = buildPolicy(
      claims.sub,
      event.methodArn,
      {user: claims.uid}
    );
    callback(null, policyDocument);
  });

};