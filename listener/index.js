require("dotenv").config();

const getCollection = require("./get-collection");

const monitors = new (require("bull"))("monitors", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

monitors.on("global:completed", async (jobKey, result) => {
  const collection = await getCollection();

  const report = JSON.parse(result);
  report.fetchTime = new Date(report.fetchTime);

  await collection.insertOne(report);
});
