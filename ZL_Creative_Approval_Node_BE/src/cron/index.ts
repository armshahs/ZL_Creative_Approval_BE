// import cron from "node-cron";
// import { logger } from "../utils";
// import {
//   AuthService,
//   CronService,
//   CurrencyService,
//   MondaySlackUpdateService,
//   ShopifyDataPullService,
//   SlackIntegrationService,
//   YTVideoService,
// } from "../services";
// import { AppDataSource } from "../database";
// import { RecalculationProducer, OnboardingProducer } from "../jobs/producers";

// export const initializeCrons = () => {
//   // Cron Job: DataIngestionCron – runs every 15 minutes
//   cron.schedule("*/15 * * * *", async () => {
//     try {
//       //--------------------------------
//       console.log("Starting DataIngestion & Actuals Data updation");
//       // Update empty client names with slack channel names - for sentiment tracker
//       const slackIntegrationService = new SlackIntegrationService();
//       await slackIntegrationService.updateEmptyClientNamesWithSlackChannelNames();
//       // Add Data Ingestion Cron job to queue to unblock the cron - 3AM melbourne time
//       const cronService = new CronService();
//       await cronService.cronEnqueueDataIngestionJobs();
//       // Meta Data Update Cron job - at 4AM melbourne time
//       await RecalculationProducer.addMetaDataUpdateCronJob();
//       // Tiktok Data Update Cron job - at 6AM & 12PM melbourne time
//       await RecalculationProducer.addTiktokDataUpdateCronJob();
//       // Google Data Update Cron job - at 7AM melbourne time
//       await RecalculationProducer.addGoogleDataUpdateCronJob();
//       // Meta Region split data update cron job - at 8AM melbourne time
//       await RecalculationProducer.addMetaRegionSplitDataUpdateCronJob();
//       // Google Region split data update cron job - at 9AM melbourne time
//       await RecalculationProducer.addGoogleRegionSplitDataUpdateCronJob();
//       // Add BSD Index Cron job to queue after data ingestion cron job is completed - at 9AM melbourne time
//       await RecalculationProducer.addBsdIndexCronJob();
//       console.log("Added DataIngestion & Actuals Data updation to queue");
//       logger.info("Added DataIngestion & Actuals Data updation to queue");
//     } catch (error) {
//       console.log("Error in DataIngestion & Actuals Data updation:", error);
//       logger.error("Error in DataIngestion & Actuals Data updation:", error);
//     }
//   });

//   // Cron Job: Lead Strategist channel mapping sync – runs every 15 minutes
//   cron.schedule("*/15 * * * *", async () => {
//     try {
//       console.log("Starting Lead Strategist channel mapping sync");
//       const slackIntegrationService = new SlackIntegrationService();
//       await slackIntegrationService.syncLeadStrategistChannelMappings();
//       console.log("Completed Lead Strategist channel mapping sync");
//       logger.info("Completed Lead Strategist channel mapping sync");
//     } catch (error) {
//       console.log("Error in Lead Strategist channel mapping sync:", error);
//       logger.error("Error in Lead Strategist channel mapping sync:", error);
//     }
//   });

//   // Cron Job: Incrementality – runs every 15 minutes
//   cron.schedule("*/15 * * * *", async () => {
//     try {
//       // Add Monday Slack Messages Cron job to queue after data ingestion cron job is completed - at 10AM melbourne time
//       const mondaySlackUpdateService = new MondaySlackUpdateService();
//       await mondaySlackUpdateService.cronSendMondaySlackMessages();
//       //--------------------------------
//       console.log("Starting Incrementality Data updation");
//       // Incrementality data update cron job - at 10AM & 1PM melbourne time
//       await RecalculationProducer.addIncrementalityDataUpdateCronJob();
//       // Incrementality Dif-in-Dif cron job
//       await RecalculationProducer.addIncrementalityDifInDifCronJob();
//       // Incrementality Causal Impact cron job
//       await RecalculationProducer.addIncrementalityCausalImpactCronJob();
//       console.log("Added Incrementality Data updation to queue");
//       logger.info("Added Incrementality Data updation to queue");
//     } catch (error) {
//       console.log("Error in Incrementality Data updation:", error);
//       logger.error("Error in Incrementality Data updation:", error);
//     }
//   });

// };

// // Initialize DB or else crons with model dependency will fail
// AppDataSource.initialize()
//   .then(() => {
//     console.log("Database connected for crons");
//     logger.info(`Database connected for crons`);
//     // Initialize crons after DB is ready
//     initializeCrons();
//     console.log("Crons started");
//     logger.info(`Crons started`);
//   })
//   .catch((error) => console.log(error));
