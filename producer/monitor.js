const crypto = require("crypto");
const monitors = new (require("bull"))("monitors", process.env.REDIS);

exports.create = async (req) => {
  const tenantId = req.body["tenant-id"];
  const monitor = req.body.monitor;

  const monitorId = `${tenantId}~${crypto.randomUUID()}`;

  await monitors.add(
    { ...monitor, id: monitorId },
    {
      jobId: monitorId,
      repeat: {
        cron: `0  ${monitor["hour-zone"]} * * *`,
        tz: "Europe/Moscow",
      },
    }
  );

  // TODO: Have a list of tenant's jobs?

  return monitorId;
};

exports.delete = async (req, res) => {
  const monitorId = req.params.id;

  // FIXME: This digs a bit too deep into the bull's internals.
  // Better way would be to store the initial job configuration
  // when adding it, so we could look up the cron corresponding
  // to the job in our storage.
  const monitorConfigs = await monitors.getRepeatableJobs();
  const job = monitorConfigs.find((job) => job.id === monitorId);

  if (job) {
    console.log(job);
    await monitors.removeRepeatableByKey(job.key);
    // await monitors.removeRepeatable({
    //   jobId: job.id,
    //   cron: job.cron,
    // });
  }

  res.code(204);
};
