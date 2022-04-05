require("dotenv").config();

const path = require("path");

const monitors = new (require("bull"))("monitors", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

monitors.process(2, path.join(__dirname, "process.js"));
