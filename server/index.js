require("dotenv").config();

const monitor = require("./monitor");

const fastify = require("fastify")({ logger: true });

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

fastify.listen(process.env.PORT).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
