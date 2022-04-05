require("dotenv").config();

const path = require("path");

const monitors = new (require("bull"))("monitors", {
  redis: {
    sentinels: [{ host: process.env.REDIS_HOST, port: 26379 }],
    name: "redis-literoad",
    password: process.env.REDIS_PASSWORD,
    role: "master",
  },
});

monitors.process(2, path.join(__dirname, "process.js"));
