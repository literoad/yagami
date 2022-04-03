const { MongoClient } = require("mongodb");

const parentClient = new MongoClient(process.env.MONGO);
const clientPromise = parentClient.connect();

exports.latest = async function (req) {
  const monitorIds = req.body.ids;

  const client = await clientPromise;
  const result = await client
    .db("yagami")
    .collection("measurements")
    .aggregate([
      {
        $match: {
          "metadata.id": {
            $in: monitorIds,
          },
        },
      },
      {
        $sort: { fetchTime: 1 },
      },
      {
        $group: {
          _id: "$metadata.id",
          measurement: { $last: "$categories" },
          timestamp: { $last: "$fetchTime" },
        },
      },
      {
        $project: {
          timestamp: 1,
          "lastResult.performance": "$measurement.performance.score",
          "lastResult.bestPractices": "$measurement['best-practices'].score",
          "lastResult.seo": "$measurement.seo.score",
        },
      },
    ]);

  const response = {};
  await result.forEach((doc) => {
    response[doc._id] = doc;
  });

  return response;
};
