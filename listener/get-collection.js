const { MongoClient } = require("mongodb");

let collection;

module.exports = async function () {
  if (collection) {
    return collection;
  }

  const client = new MongoClient(process.env.MONGO);
  await client.connect();

  const db = client.db("yagami");

  try {
    await db.createCollection("measurements", {
      timeseries: {
        timeField: "fetchTime",
        metaField: "metadata",
        granularity: "hours",
      },
      expireAfterSeconds: 31536000,
    });
    await db.collection("measurements").createIndex({
      "metadata.id": 1,
      fetchTime: 1,
    });
  } catch (e) {
    console.log("collection already exists");
  }

  collection = db.collection("measurements");

  return collection;
};
