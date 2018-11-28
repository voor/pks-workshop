const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const RedisStore = require("connect-redis")(session);

const passport = require("passport");
const OpenIDStrategy = require("passport-openid").Strategy;

const port = process.env.NODE_PORT || 8080;
const {
  OPENID_URL,
  OPENID_DISCOVERY_CLIENT_ID,
  OPENID_DISCOVERY_CLIENT_SECRET,
  OPENID_REDIRECT_URI,
  REDIS_SESSION_SECRET,
  OPENID_DISCOVERY_URL,
  REDIS_HOST
} = process.env;

const app = express();

const client = redis.createClient({
  host: REDIS_HOST,
  retry_strategy: options => new Error("Fail")
});

const redisStoreOptions = { client };

app.use(
  session({
    store: new RedisStore(redisStoreOptions),
    secret: REDIS_SESSION_SECRET,
    resave: false
  })
);
app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// configure Express
// app.configure(function() {
//   // app.set("views", __dirname + "/views");
//   // app.set("view engine", "ejs");

//   app.use(express.logger());
//   app.use(express.cookieParser());
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());

//   app.use(app.router);
//   app.use(express.static(__dirname + "/../../public"));
// });

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the OpenID identifier is serialized and
//   deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.identifier);
});

passport.deserializeUser(function(identifier, done) {
  done(null, { identifier: identifier });
});

passport.use(
  new OpenIDStrategy(
    {
      returnURL: OPENID_REDIRECT_URI,
      providerURL: OPENID_DISCOVERY_URL,
      realm: OPENID_URL
    },
    (identifier, done) => {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // To keep the example simple, the user's OpenID identifier is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the OpenID identifier with a user record in your database,
        // and return that user instead.
        return done(null, { identifier });
      });
    }
  )
);

const auth = async () => {
  app.get("/auth/login", function(req, res) {
    res.send(`<form action="/auth/openid" method="post">
                <div>
                    <label>OpenID:</label>
                    <input type="text" name="openid_identifier"/><br/>
                </div>
                <div>
                    <input type="submit" value="Sign In"/>
                </div>
              </form>`);
  });

  app.post("/auth/openid", passport.authenticate("openid"));

  app.get(
    "/auth/callback",
    passport.authenticate("openid", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  const server = app.listen(port, () => {
    console.log(`server started on port ${server.address().port}`);
  });
};

auth();
