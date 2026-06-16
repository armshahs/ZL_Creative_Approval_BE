// import { Worker } from "bullmq";
// import { redisConfig } from "../../config";
// import Redis from "ioredis";
// // import { createRedisConnection } from "../../config/redis.config";

// // const redisConnection = createRedisConnection();
// const redisConnection = new Redis(redisConfig);

// const worker = new Worker(
//   "timeout-demo",
//   async (job) => {
//     const { timeoutMs } = job.data;

//     // Simulate some work with a timeout
//     await new Promise((resolve) => setTimeout(resolve, timeoutMs));

//     console.log(`Job ${job.id} completed after ${timeoutMs}ms timeout`);
//     return { success: true, timeoutMs };
//   },
//   {
//     connection: redisConnection,
//     concurrency: 5,
//     limiter: {
//       max: 10,
//       duration: 1000,
//     },
//   },
// );

// worker.on("completed", (job) => {
//   console.log(`Job ${job.id} has completed successfully`);
// });

// worker.on("failed", (job, err) => {
//   console.error(`Job ${job?.id} has failed with error ${err.message}`);
// });
