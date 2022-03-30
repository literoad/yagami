require("dotenv").config();

const getCollection = require("./get-collection");

const monitors = new (require("bull"))("monitors", process.env.REDIS);

monitors.on("global:completed", async (jobKey, result) => {
  console.log(result);

  const collection = await getCollection();
  await collection.insertOne(JSON.parse(result));
});
