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

  // FIXME Detect when the lighthouse run failed and configure
  // job retry. Better yet, fix this in ryuk by returning the 500 status

  const {
    requestedUrl,
    finalUrl,
    fetchTime,
    lighthouseVersions,
    categories,
    userAgent,
    timing,
  } = await reportResult.json();

  return {
    requestedUrl,
    finalUrl,
    fetchTime: Date.parse(fetchTime),
    lighthouseVersions,
    categories,
    userAgent,
    timing,
    metadata: {
      "tenant-id": job.id.split("~")[0],
      id: job.id,
    },
  };
};
