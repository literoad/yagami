require("dotenv").config();

const monitors = require("./monitors");
const aggregator = require("./aggregator");

const fastify = require("fastify")({ logger: true });

fastify.register(require("fastify-graceful-shutdown"));

fastify.post(
  "/monitors",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          "tenant-id": { type: "string" },
          monitor: {
            type: "object",
            properties: {
              url: { type: "string" },
              "hour-zone": { type: "string" },
            },
            required: ["url", "hour-zone"],
          },
        },
        required: ["tenant-id", "monitor"],
      },
    },
  },
  monitors.create
);

fastify.delete("/monitors/:id", {}, monitors.delete);

fastify.post(
  "/aggregator/latest",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          ids: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["ids"],
      },
    },
  },
  aggregator.latest
);

fastify.post(
  "/aggregator/range",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          id: { type: "string" },
          from: { type: "string" },
          to: { type: "string" },
        },
        required: ["id"],
      },
    },
  },
  aggregator.range
);

fastify.after(() => {
  fastify.gracefulShutdown((signal, next) => {
    next();
  });
});

fastify.listen(process.env.PORT, "0.0.0.0").catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
