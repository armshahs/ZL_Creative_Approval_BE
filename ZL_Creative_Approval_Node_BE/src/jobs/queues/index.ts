// import { Queue } from "bullmq";
// // import { createRedisConnection } from "../../config/redis.config";
// import { redisConfig } from "../../config";
// import Redis from "ioredis";

// // const redisConnection = createRedisConnection();
// const redisConnection = new Redis(redisConfig);

// export const recalculationQueue = new Queue("recalculation", {
//   connection: redisConnection,
//   defaultJobOptions: {
//     attempts: 3,
//     backoff: {
//       type: "exponential",
//       delay: 1000,
//     },
//     removeOnComplete: true, // Redis memory optimization
//     removeOnFail: 3, // Redis memory optimization
//   },
// });

// export const onboardingQueue = new Queue("onboarding", {
//   connection: redisConnection,
//   defaultJobOptions: {
//     attempts: 2, // Fewer attempts for onboarding (long-running jobs)
//     backoff: {
//       type: "exponential",
//       delay: 5000, // Longer delay for onboarding retries
//     },
//     removeOnComplete: true, // Redis memory optimization
//     removeOnFail: 2, // Keep fewer failed jobs for onboarding
//   },
// });

// // export * from "./timeout-demo.queue";
