const crypto = require("crypto");
const monitors = new (require("bull"))("monitors");

exports.create = async function (req) {
  const tenantId = req.body["tenant-id"];
  const monitor = req.body.monitor;

  const monitorId = `${tenantId}~${crypto.randomUUID()}`;

  const job = await monitors.add(
    { ...monitor, id: monitorId },
    {
      jobId: monitorId,
      repeat: {
        cron: `0  ${monitor["hour-zone"]} * *`,
        tz: "Europe/Moscow",
      },
    }
  );

  // TODO: Have a list of tenant's jobs?

  return monitors.toKey(job);
};

exports.delete = async function (req) {
  const monitorKey = req.params.id;
  await monitors.removeRepeatableByKey(monitorKey);
};
