const { MongoClient } = require("mongodb");

module.exports = async function () {
  const client = new MongoClient(process.env.MONGO);
  await client.connect();

  const db = client.db(process.env.MONGO_DB_NAME);

  return await db.createCollection(process.env.MONGO_COLLECTION_NAME, {
    timeseries: {
      timeField: "fetchTime",
      metaField: "metadata",
      granularity: "hours",
    },
  });
};
