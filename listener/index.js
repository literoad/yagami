require("dotenv").config();

const monitors = new (require("bull"))("monitors", process.env.REDIS);
const collection = await require("./init-db")();

monitors.on("completed", async (job, result) => {
  const resultWithMeta = {
    ...result,
    metadata: {
      id: job.id,
      tenant: job.id.split("~")[0],
    },
  };
  await collection.insertOne(resultWithMeta);
});
