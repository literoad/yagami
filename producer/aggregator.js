const { MongoClient } = require("mongodb");
const moment = require("moment");

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
          "lastResult.bestPractices": `$measurement.best\-practices.score`,
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

exports.range = async function (req) {
  const monitorId = req.body.id;

  const to = req.body.to ? moment(req.body.to) : moment();
  const from = req.body.from
    ? moment(req.body.from)
    : moment(to).subtract(1, "year").startOf("day");

  const client = await clientPromise;
  const result = await client
    .db("yagami")
    .collection("measurements")
    .aggregate([
      {
        $match: {
          "metadata.id": {
            $eq: monitorId,
          },
          fetchTime: {
            $gte: from.toDate(),
            $lte: to.toDate(),
          },
        },
      },
      {
        $sort: { fetchTime: 1 },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fetchTime" } },
          performance: { $avg: "$categories.performance.score" },
          bestPractices: { $avg: `$categories.best\-practices.score` },
          seo: { $avg: "$categories.seo.score" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

  return result.toArray();
};
