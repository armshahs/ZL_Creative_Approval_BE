// import { Queue } from "bullmq";
// // import { createRedisConnection } from "../../config/redis.config";
// import { redisConfig } from "../../config";
// import Redis from "ioredis";

// // const redisConnection = createRedisConnection();
// const redisConnection = new Redis(redisConfig);

// export const timeoutDemoQueue = new Queue("timeout-demo", {
//   connection: redisConnection,
//   defaultJobOptions: {
//     attempts: 3,
//     backoff: {
//       type: "exponential",
//       delay: 1000,
//     },
//     removeOnComplete: true, // Redis memory optimization
//     removeOnFail: 10, // Redis memory optimization
//   },
// });
