require("dotenv").config();

const monitors = require("./monitors");

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

fastify.after(() => {
  fastify.gracefulShutdown((signal, next) => {
    next();
  });
});

fastify.listen(process.env.PORT, "0.0.0.0").catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
