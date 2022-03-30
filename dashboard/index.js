require("dotenv").config();

const fastify = require("fastify")({ logger: true });
const monitors = new (require("bull"))("monitors", process.env.REDIS);

const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { FastifyAdapter } = require("@bull-board/fastify");

fastify.register(require("fastify-graceful-shutdown"));

const queueAdapter = new BullAdapter(monitors);
const serverAdapter = new FastifyAdapter();

createBullBoard({
  queues: [queueAdapter],
  serverAdapter,
});

fastify.register(serverAdapter.registerPlugin());

fastify.after(() => {
  fastify.gracefulShutdown((signal, next) => {
    next();
  });
});

fastify.listen(process.env.PORT, "0.0.0.0").catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
