require("dotenv").config();

const fastify = require("fastify")({ logger: true });

fastify.get("/", async () => "Do you know Gods of Death love apples?");

fastify.listen(process.env.PORT).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
