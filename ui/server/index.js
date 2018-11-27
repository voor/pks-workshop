const express = require("express");
const proxy = require("http-proxy-middleware");
const path = require("path");
const port = process.env.NODE_PORT || 8080;
const app = express();
const { PROXY_HOST, PROXY_LOG_LEVEL } = process.env;

const route = "/api";

app.disable("x-powered-by");

// serve static assets normally
app.use(express.static(path.resolve(__dirname, "../build")));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("*", function(request, response) {
  response.sendFile(path.resolve(__dirname, "../build/index.html"));
});

if (PROXY_HOST) {
  const proxyOptions = {
    target: PROXY_HOST,
    changeOrigin: true,
    logLevel: PROXY_LOG_LEVEL
  };
  app.use(route, proxy(proxyOptions));
}

const server = app.listen(port, () => {
  console.log(`server started on port ${server.address().port}`);
  if (PROXY_HOST) {
    console.log(`Proxying requests to ${route} to ${PROXY_HOST}`);
  } else {
    console.log(
      "Not proxying any api requests, since no PROXY_HOST was defined."
    );
  }
});
