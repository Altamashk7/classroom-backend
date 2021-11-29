const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  // const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    // isRevoked: isRevoked
  }).unless({
    path: [
      `/mentee/login`,
      `/mentee/register`,
      `/`,
      `/mentor/login`,
      `/mentor/register`,
      `/mentor/category/6198e265da2c0d17668aec19`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
