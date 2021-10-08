const redis = require("redis");
const rclient = redis.createClient();

rclient.on("connect", (err, res) => {
  "use strict";
  if (err) console.log(err);
  console.log("Connected to redis database");
});

module.exports = rclient;
