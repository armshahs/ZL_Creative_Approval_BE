// import { Worker } from "bullmq";
// import { redisConfig } from "../../config";
// import Redis from "ioredis";
// import { BrandOnboardingService } from "../../services";
// import { AppDataSource } from "../../database";
// import { logger } from "../../utils";
// import { JOB_TYPES } from "../producers";

// const redisConnection = new Redis(redisConfig);

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Database connected for onboarding worker");
//     logger.info(`Database connected for onboarding worker`);
//   })
//   .catch((error) => console.log(error));

// const brandOnboardingService = new BrandOnboardingService();

// const onboardingWorker = new Worker(
//   // name should match the queue name
//   "onboarding",
//   async (job) => {
//     try {
//       if (job.name === JOB_TYPES.BRAND_ONBOARDING_CRON) {
//         console.log("ONBOARDING WORKER - Brand Onboarding Cron job started");
//         await brandOnboardingService.brandOnboardingCron();
//         console.log("ONBOARDING WORKER - Brand Onboarding Cron job completed");
//       } else if (job.name === JOB_TYPES.TEST_ONBOARDING_JOB) {
//         console.log("🚀🚀🚀 ONBOARDING WORKER - Test Onboarding Job started");
//         // Run for 30 seconds
//         await new Promise((resolve) => setTimeout(resolve, 5000));
//         console.log("ONBOARDING WORKER - Test Onboarding Job completed");
//       } else {
//         console.log(
//           `ONBOARDING WORKER - Skipping job ${job.id} as it's not available in onboarding jobs`,
//         );
//       }
//     } catch (error) {
//       console.error(
//         `ONBOARDING WORKER - Error processing job ${job.id}:`,
//         error,
//       );
//       logger.error(
//         `ONBOARDING WORKER - Error processing job ${job.id}:`,
//         error,
//       );
//       throw error; // Re-throw to trigger retry mechanism
//     }
//   },
//   {
//     connection: redisConnection,
//     concurrency: 1, // Run onboarding jobs one at a time (sequential processing)
//     limiter: {
//       max: 10, // Only 10 jobs per minute for onboarding (long-running jobs). You can also change this to 1 request per minute. The concurrency 1 makes this redundant anyway.
//       duration: 1000, // 1 second
//     },
//     lockDuration: 1800000, // 30 minutes lock duration (onboarding jobs are long-running)
//     stalledInterval: 60000, // Check for stalled jobs every 60 seconds
//     maxStalledCount: 3, // Allow 3 stalled checks before marking as failed
//   },
// );

// onboardingWorker.on("completed", (job) => {
//   console.log(`ONBOARDING WORKER - Job ${job.id} has completed`);
//   logger.info(`ONBOARDING WORKER - Job ${job.id} has completed`);
// });

// onboardingWorker.on("failed", (job, err) => {
//   console.error(
//     `ONBOARDING WORKER - Job ${job?.id} has failed with error ${err.message}`,
//   );
//   logger.error(
//     `ONBOARDING WORKER - Job ${job?.id} has failed with error ${err.message}`,
//     err,
//   );
// });

// onboardingWorker.on("error", (err) => {
//   console.error("ONBOARDING WORKER - Worker error:", err);
//   logger.error("ONBOARDING WORKER - Worker error:", err);
// });

// onboardingWorker.on("stalled", (jobId) => {
//   console.error(`ONBOARDING WORKER - Job ${jobId} has stalled`);
//   logger.error(`ONBOARDING WORKER - Job ${jobId} has stalled`);
// });
