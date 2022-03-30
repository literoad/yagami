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
  return await reportResult.json();
};
