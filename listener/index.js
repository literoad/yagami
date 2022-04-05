require("dotenv").config();

const getCollection = require("./get-collection");

const monitors = new (require("bull"))("monitors", {
  redis: {
    sentinels: [{ host: process.env.REDIS_HOST, port: 26379 }],
    name: "redis-literoad",
    password: process.env.REDIS_PASSWORD,
    role: "master",
  },
});

monitors.on("global:completed", async (jobKey, result) => {
  const collection = await getCollection();

  const report = JSON.parse(result);
  report.fetchTime = new Date(report.fetchTime);

  await collection.insertOne(report);
});
