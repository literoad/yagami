require("dotenv").config();

const job = require("./routes/job");

const fastify = require("fastify")({ logger: true });

fastify.get("/", async () => "Do you know Gods of Death love apples?");

fastify.post(
  "/job",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          "tenant-id": { type: "string" },
          job: {
            type: "object",
            properties: {
              url: { type: "string" },
              "hour-zone": { type: "string" },
            },
            required: ["url", "hour-zone"],
          },
        },
        required: ["tenant-id", "job"],
      },
    },
  },
  job.create
);

fastify.put(
  "/job/:id",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          job: {
            type: "object",
            properties: {
              url: { type: "string" },
              "hour-zone": { type: "string" },
            },
          },
        },
        required: ["job"],
      },
    },
  },
  job.update
);

fastify.delete("/job/:id", {}, job.delete);

fastify.listen(process.env.PORT).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
