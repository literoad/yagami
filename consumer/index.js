const path = require("path");

const monitors = new (require("bull"))("monitors", process.env.REDIS);

monitors.process(2, path.join(__dirname, "process.js"));
