require("dotenv").config();

const fetch = require("node-fetch");

module.exports = async function (job) {
  const reportResult = await fetch(process.env.RYUK_URL, {
    method: "POST",
    headers: {
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
