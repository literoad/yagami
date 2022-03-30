const { MongoClient } = require("mongodb");

let collection;

module.exports = async function () {
  if (collection) {
    return collection;
  }

  const client = new MongoClient(process.env.MONGO);
  await client.connect();

  const db = client.db(process.env.MONGO_DB_NAME);
  console.log("created db");

  try {
    await db.createCollection(process.env.MONGO_COLLECTION_NAME, {
      timeseries: {
        timeField: "fetchTime",
        metaField: "metadata",
        granularity: "hours",
      },
    });
    console.log("created collection");
  } catch (e) {
    console.log("collection already exists");
  }

  collection = db.collection(process.env.MONGO_COLLECTION_NAME);

  return collection;
};
