exports.create = async function (req) {
  const tenantId = req.body["tenant-id"];
  const job = req.body.job;
};

exports.update = async function (req) {
  const jobId = req.params.id;
  const jobDiff = req.body.job;
};

exports.delete = async function (req) {
  const jobId = req.params.id;
};
