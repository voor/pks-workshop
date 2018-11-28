const express = require("express");
const bodyParser = require("body-parser");
const { Issuer } = require("openid-client");
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const port = process.env.NODE_PORT || 8080;
const {
  OPENID_DISCOVERY_URL,
  OPENID_DISCOVERY_CLIENT_ID,
  OPENID_DISCOVERY_CLIENT_SECRET,
  OPENID_REDIRECT_URI,
  REDIS_SESSION_SECRET,
  REDIS_HOST
} = process.env;

const app = express();

const client = redis.createClient({
  host: REDIS_HOST,
  retry_strategy: options => new Error("Fail")
});

app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }));

const redisStoreOptions = { client };

app.use(
  session({
    store: new RedisStore(redisStoreOptions),
    secret: REDIS_SESSION_SECRET,
    resave: false
  })
);

const auth = async () => {
  const issuer = await Issuer.discover(OPENID_DISCOVERY_URL);

  console.log("Discovered issuer %s %O", issuer.issuer, issuer.metadata);

  const client = new issuer.Client({
    client_id: OPENID_DISCOVERY_CLIENT_ID,
    client_secret: OPENID_DISCOVERY_CLIENT_SECRET
  });

  loginHtml = client.authorizationUrl({
    redirect_uri: OPENID_REDIRECT_URI,
    scope: "openid"
  });

  console.log(loginHtml);

  app.get("/auth/login", function(req, res) {
    res.send(`<a href="${loginHtml}">Login</a>`);
  });

  app.use("/auth/callback", (req, res, next) => {
    console.log("In here");
    client
      .authorizationCallback(OPENID_REDIRECT_URI, req.query) // => Promise
      .then(function(tokenSet) {
        console.log("received and validated tokens %j", tokenSet);
        console.log("validated id_token claims %j", tokenSet.claims);
        res.send(JSON.stringify(tokenSet));
      });
  });

  const server = app.listen(port, () => {
    console.log(`server started on port ${server.address().port}`);
  });
};

auth();
