require("dotenv").config();

const monitor = require("./monitor");

const fastify = require("fastify")({ logger: true });

fastify.register(require("fastify-graceful-shutdown"));

fastify.get("/", async () => "Do you know Gods of Death love apples?");

fastify.post(
  "/monitor",
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
  monitor.create
);

fastify.delete("/monitor/:id", {}, monitor.delete);

fastify.after(() => {
  fastify.gracefulShutdown((signal, next) => {
    next();
  });
});

fastify.listen(process.env.PORT, "0.0.0.0").catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
