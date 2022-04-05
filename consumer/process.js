require("dotenv").config();

const fetch = require("node-fetch");

module.exports = async function (job) {
  // Check if the users's subscription is active
  const userRq = await fetch(
    `${process.env.SHINGO_URL}/users/${job.data.tenant}`,
    {
      method: "GET",
      header: {
        Authorization: `Api-Key ${process.env.SERVICE_KEY}`,
      },
    }
  );
  const user = await userRq.json();

  // If subscription lapsed, discard the job. It will still have its
  // repeatable variant in queue though, in case tenant reactivates
  if (!user?.active) {
    await job.discard();
    return;
  }

  // Request lighthouse audit
  const reportResult = await fetch(process.env.RYUK_URL, {
    method: "POST",
    headers: {
      Authorization: `Api-Key ${process.env.SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: job.data.url,
    }),
  });

  const report = await reportResult.json();

  return {
    requestedUrl: report.requestedUrl,
    finalUrl: report.finalUrl,
    fetchTime: report.fetchTime,
    lighthouseVersions: report.lighthouseVersions,
    categories: report.categories,
    userAgent: report.userAgent,
    metadata: {
      "tenant-id": job.data.tenant,
      id: job.data.id,
    },
  };
};
