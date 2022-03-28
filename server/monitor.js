exports.create = async function (req) {
  const tenantId = req.body["tenant-id"];
  const monitor = req.body.monitor;
};

exports.delete = async function (req) {
  const monitorId = req.params.id;
};
