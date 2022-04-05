require("dotenv").config();

const fastify = require("fastify")({ logger: true });
const monitors = new (require("bull"))("monitors", {
  redis: {
    sentinels: [{ host: process.env.REDIS_HOST, port: 26379 }],
    name: "redis-literoad",
    password: process.env.REDIS_PASSWORD,
    role: "master",
  },
});

const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { FastifyAdapter } = require("@bull-board/fastify");

fastify.register(require("fastify-graceful-shutdown"));
fastify.register(require("fastify-basic-auth"), {
  validate: async (login, password) => {
    if (
      login !== process.env.DASHBOARD_LOGIN ||
      password !== process.env.DASHBOARD_PASSWORD
    ) {
      return new Error("Invalid authentication");
    }
  },
  authenticate: true,
});

const queueAdapter = new BullAdapter(monitors);
const serverAdapter = new FastifyAdapter();
serverAdapter.setBasePath("/ui");

createBullBoard({
  queues: [queueAdapter],
  serverAdapter,
});

fastify.after(() => {
  fastify.register(serverAdapter.registerPlugin(), { prefix: "/ui" });

  fastify.get("/", async (req, res) => {
    res.redirect("/ui");
  });

  fastify.addHook("onRequest", fastify.basicAuth);

  fastify.gracefulShutdown((signal, next) => {
    next();
  });
});

fastify.listen(process.env.PORT, "0.0.0.0").catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
