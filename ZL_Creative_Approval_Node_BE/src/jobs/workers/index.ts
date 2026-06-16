// import { Worker } from "bullmq";
// import { redisConfig } from "../../config";
// import Redis from "ioredis";
// // import { createRedisConnection } from "../../config/redis.config";
// import {
//   CalculationTriggerService,
//   CohortAnalysisService,
//   MetaAdsService,
//   GoogleAdsService,
//   TiktokAdsService,
//   PodService,
//   ShopifySalesChannelService,
//   IncrementalityAnalysisService,
//   S3IncrementalityAnalysisService,
// } from "../../services";
// import { AppDataSource } from "../../database";
// import { logger, getEarlierDate } from "../../utils";
// import { JOB_TYPES } from "../producers";
// import {
//   CronService,
//   BsdIndexService,
//   AISummaryService,
//   MondaySlackUpdateService,
// } from "../../services";
// import { IncrementalityAnalysisRepositoryCustom, TiktokAdsRepositoryCustom } from "../../repositories";

// // const redisConnection = createRedisConnection();
// const redisConnection = new Redis(redisConfig);

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Database connected for worker");
//     // Add logging
//     logger.info(`Database connected for worker`);
//   })
//   .catch((error) => console.log(error));

// const calculationTriggerService = new CalculationTriggerService();
// const cohortAnalysisService = new CohortAnalysisService();
// const bsdIndexService = new BsdIndexService();
// const aiSummaryService = new AISummaryService();
// const metaAdsService = new MetaAdsService();
// const googleAdsService = new GoogleAdsService();
// const tiktokAdsRepositoryCustom = new TiktokAdsRepositoryCustom();
// const tiktokAdsService = new TiktokAdsService(tiktokAdsRepositoryCustom);
// const incrementalityAnalysisRepositoryCustom =
//   new IncrementalityAnalysisRepositoryCustom();
// const incrementalityAnalysisService = new IncrementalityAnalysisService(
//   incrementalityAnalysisRepositoryCustom,
// );
// const s3IncrementalityAnalysisService = new S3IncrementalityAnalysisService(
//   incrementalityAnalysisRepositoryCustom,
// );

// const cpuIntensiveTask = () => {
//   console.log("WORKER - CPU Intensive Task started");
//   // Perform CPU-intensive calculations
//   let result = 0;
//   for (let i = 0; i < 50000000; i++) {
//     result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
//   }
//   console.log("WORKER - CPU Intensive Task completed", result);
// };

// const worker = new Worker(
//   // name should match the queue name
//   "recalculation",
//   async (job) => {
//     try {
//       // Check if this is a UE recalculation job
//       if (job.name === JOB_TYPES.UE_RECALCULATION) {
//         console.log("WORKER - UE recalculation job started");
//         const { brandId, year } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterUeInputsUpdate(
//           brandId,
//           year,
//         );
//         console.log("WORKER - UE recalculation job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.RM_RECALCULATION) {
//         console.log("WORKER - RM recalculation job started");
//         const { brandId, year } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterRmInputsUpdate(
//           brandId,
//           year,
//         );
//         console.log("WORKER - RM recalculation job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.ADJUSTMENTS_RECALCULATION) {
//         console.log("WORKER - Adjustments recalculation job started");
//         const { brandId, year } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterAdjustmentsUpdate(
//           brandId,
//           year,
//         );
//         console.log("WORKER - Adjustments recalculation job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.SEASONALITY_RECALCULATION) {
//         console.log("WORKER - Seasonality recalculation job started");
//         const { brandId, year } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterSeasonalityUpdate(
//           brandId,
//           year,
//         );
//         console.log("WORKER - Seasonality recalculation job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.COHORT_RC_ANALYSIS_RECALCULATION) {
//         console.log("WORKER - Cohort analysis recalculation job started");
//         const { brandId, year } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterCohortAnalysisUpdate(
//           brandId,
//           year,
//         );
//         console.log("WORKER - Cohort analysis recalculation job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.SALES_CHANNEL_RECALCULATION) {
//         console.log("WORKER - Sales Channel recalculation job started");
//         const { brandId } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterSalesChannelUpdate(
//           brandId,
//         );
//         console.log("WORKER - Sales Channel recalculation job completed");
//         //--------------------------------
//       } else if (
//         job.name === JOB_TYPES.SHIPPING_ADDRESS_COUNTRY_CODE_RECALCULATION
//       ) {
//         console.log(
//           "WORKER - Shipping Address Country Code recalculation job started",
//         );
//         const { brandId } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterShippingAddressCountryCodeUpdate(
//           brandId,
//         );
//         console.log(
//           "WORKER - Shipping Address Country Code recalculation job completed",
//         );
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.AD_ACCOUNTS_RECALCULATION) {
//         console.log("WORKER - Ad Accounts recalculation job started");
//         const { brandId } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterAllAdAccountsUpdate(
//           brandId,
//         );
//         console.log("WORKER - Ad Accounts recalculation job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.DATA_INGESTION_CRON) {
//         console.log("WORKER - Data Ingestion Cron job started");
//         const { brandIds } = job.data as { brandIds?: string[] };
//         if (!brandIds?.length) {
//           logger.warn(
//             "DATA_INGESTION_CRON: no brandIds in job payload, skipping",
//           );
//           return;
//         }
//         const cronService = new CronService();
//         await cronService.ingestAndUpdateActualsDataForAllBrands(brandIds);
//         console.log("WORKER - Data Ingestion Cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.MARKETING_EVENT_RECALCULATION) {
//         console.log("WORKER - Marketing Event recalculation job started");
//         const { brandId, year } = job.data;
//         await calculationTriggerService.triggerRecalculationAfterMarketingEventUpdate(
//           brandId,
//           year,
//         );
//         console.log("WORKER - Marketing Event recalculation job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.RC_COHORT_GENERATION_CRON) {
//         console.log("WORKER - RC Cohort Generation Cron job started");
//         const { timePeriod } = job.data;
//         await cohortAnalysisService.runAllBrandsRetentionCohortAnalysis(
//           timePeriod,
//         );
//         console.log("WORKER - RC Cohort Generation Cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.BSD_INDEX_CRON) {
//         console.log("WORKER - BSD Index Cron job started");
//         await bsdIndexService.generateAllBrandsBsdiMetrics("prevDay");
//         console.log("WORKER - BSD Index Cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.SAMPLE_CPU_INTENSIVE_JOB) {
//         console.log("WORKER - Sample CPU Intensive Job started");
//         await cpuIntensiveTask();
//         console.log("WORKER - Sample CPU Intensive Job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.AI_SUMMARY_GENERATION_CRON) {
//         console.log("WORKER - AI Summary Generation Cron job started");
//         await aiSummaryService.allBrandsAISummary();
//         console.log("WORKER - AI Summary Generation Cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.META_DATA_UPDATE_CRON) {
//         console.log("WORKER - Meta Data Update Cron job started");
//         await metaAdsService.metaAdMetricsDailyRefresh();
//         console.log("WORKER - Meta Data Update Cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.GOOGLE_DATA_UPDATE_CRON) {
//         console.log("WORKER - Google Data Update Cron job started");
//         await googleAdsService.googleAdMetricsDailyRefresh();
//         console.log("WORKER - Google Data Update Cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.TIKTOK_DATA_UPDATE_CRON) {
//         console.log("WORKER - Tiktok Data Update Cron job started");
//         await tiktokAdsService.tiktokAdMetricsDailyRefresh();
//         console.log("WORKER - Tiktok Data Update Cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.POD_SYNC_DJANGO_API) {
//         console.log("WORKER - Pod Sync Django API job started");
//         await PodService.updateSentimentTrackerPodDetails();
//         console.log("WORKER - Pod Sync Django API job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.SHOPIFY_SALES_CHANNEL_UPDATE_CRON) {
//         console.log("WORKER - Shopify Sales Channel Update Cron job started");
//         const { channelStatusDefault } = job.data;
//         const shopifySalesChannelService = new ShopifySalesChannelService();
//         await shopifySalesChannelService.updateUniqueSalesChannelsforAllBrandsV2(
//           channelStatusDefault,
//         );
//         console.log("WORKER - Shopify Sales Channel Update Cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.TEST_RECALCULATION_JOB) {
//         console.log("🚀🚀 WORKER - Test Recalculation Job started");
//         // Run for 30 seconds
//         await new Promise((resolve) => setTimeout(resolve, 10000));
//         console.log("WORKER - Test Recalculation Job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.META_REGION_SPLIT_DATA_UPDATE_CRON) {
//         console.log("WORKER - Meta Region split data update cron job started");
//         await metaAdsService.dailyCronMetaAdsData();
//         console.log("WORKER - Meta Region split data update cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.GOOGLE_REGION_SPLIT_DATA_UPDATE_CRON) {
//         console.log("WORKER - Google Region split data update cron job started");
//         await googleAdsService.dailyCronGoogleAdsData();
//         console.log("WORKER - Google Region split data update cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.INCREMENTALITY_DATA_UPDATE_CRON) {
//         console.log("WORKER - Incrementality data update cron job started");
//         await incrementalityAnalysisService.dailyCronBrandDataIncrementalityAnalysis();
//         console.log("WORKER - Incrementality data update cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.INCREMENTALITY_DIF_IN_DIF_CRON) {
//         console.log("WORKER - Incrementality Dif-in-Dif cron job started");
//         await incrementalityAnalysisService.dailyCronCalculateAndSaveIncrementalChangeDifInDif();
//         console.log("WORKER - Incrementality Dif-in-Dif cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.INCREMENTALITY_CAUSAL_IMPACT_CRON) {
//         console.log("WORKER - Incrementality Causal Impact cron job started");
//         await incrementalityAnalysisService.dailyCronCalculateAndSaveIncrementalChangeCausalImpact();
//         console.log("WORKER - Incrementality Causal Impact cron job completed");
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.MONDAY_SLACK_MESSAGES_CRON) {
//         console.log("WORKER - Monday Slack messages cron job started");
//         const { brandIds, weekToCalculate } = job.data as {
//           brandIds: string[];
//           weekToCalculate?: "current" | "previous";
//         };
//         const mondaySlackUpdateService = new MondaySlackUpdateService();
//         await mondaySlackUpdateService.sendMondaySlackMessageMultipleBrandsList(
//           brandIds,
//           weekToCalculate ?? "previous",
//         );
//         console.log("WORKER - Monday Slack messages cron job completed");
//         //--------------------------------
//       } else if (
//         // job.name === JOB_TYPES.CALCULATE_PRE_TEST_AVERAGE_METRICS_DIF_IN_DIF
//         job.name === JOB_TYPES.POST_PUBLISH_PROCESSING_DIF_IN_DIF
//       ) {
//         console.log(
//           "WORKER - Post-publish processing Dif-in-Dif job started",
//         );
//         const {
//           brandId,
//           experimentStartDate,
//           experimentEndDate,
//           currentDate,
//           experimentPrimaryMetric,
//           experimentTargetUpliftPercent,
//           experimentId,
//           trainingStartDate,
//           trainingEndDate,
//           controlChildRegionIds,
//           treatmentChildRegionIds,
//           adPlatform
//         } = job.data;

//         await incrementalityAnalysisService.postExperimentProcessingGeoHoldout({
//           brandId,
//           experimentStartDate,
//           experimentEndDate,
//           currentDate,
//           experimentPrimaryMetric,
//           experimentTargetUpliftPercent,
//           experimentId,
//           trainingStartDate,
//           trainingEndDate,
//           controlChildRegionIds,
//           treatmentChildRegionIds,
//           adPlatform
//         })
//         // const {
//         //   brandId,
//         //   experimentStartDate,
//         //   experimentEndDate,
//         //   currentDate,
//         //   experimentId,
//         //   trainingStartDate,
//         //   trainingEndDate,
//         //   controlChildRegionIds,
//         //   treatmentChildRegionIds,
//         //   adPlatform,
//         // } = job.data;

//         // await incrementalityAnalysisService.calculateAndSavePreTestAverageMetricsDifInDif(
//         //   {
//         //     brandId,
//         //     experimentId,
//         //     trainingStartDate,
//         //     trainingEndDate,
//         //     controlChildRegionIds,
//         //     treatmentChildRegionIds,
//         //     adPlatform,
//         //   },
//         // );
//         // // Run calculateAndSavePostTestAverageMetricsDifInDif and calculateAndSaveReliabilityMetricsDifInDif if experiment has already started
//         // if (incrementalityAnalysisService.experimentStarted(experimentStartDate)) {
//         //   console.log("Experiment has already started");
//         //   await incrementalityAnalysisService.calculateAndSavePostTestAverageMetricsDifInDif(
//         //     {
//         //       brandId,
//         //       experimentId,
//         //       experimentStartDate,
//         //       today: getEarlierDate({
//         //         date1: currentDate,
//         //         date2: experimentEndDate,
//         //       }),
//         //       controlChildRegionIds,
//         //       treatmentChildRegionIds,
//         //       adPlatform,
//         //     },
//         //   );

//         //   await incrementalityAnalysisService.calculateAndSaveReliabilityMetricsDifInDif(
//         //     {
//         //       brandId,
//         //       experimentId,
//         //       experimentStartDate,
//         //       today: getEarlierDate({
//         //         date1: currentDate,
//         //         date2: experimentEndDate,
//         //       }),
//         //       controlChildRegionIds,
//         //       treatmentChildRegionIds,
//         //       adPlatform,
//         //     },
//         //   );
//         // }
//         console.log(
//           "WORKER - Post-publish processing Dif-in-Dif job completed",
//         );
//         //--------------------------------
//       } else if (
//         // job.name === JOB_TYPES.CALCULATE_PRE_TEST_AVERAGE_METRICS_CAUSAL_IMPACT
//         job.name === JOB_TYPES.POST_PUBLISH_PROCESSING_CAUSAL_IMPACT
//       ) {
//         console.log(
//           "WORKER - Post-publish processing Causal Impact job started",
//         );

//         const {
//           brandId,
//           experimentStartDate,
//           experimentEndDate,
//           currentDate,
//           experimentPrimaryMetric,
//           experimentTargetUpliftPercent,
//           experimentId,
//           trainingStartDate,
//           trainingEndDate,
//           treatmentChildRegionIds,
//           adPlatform
//         } = job.data;

//         await incrementalityAnalysisService.postExperimentProcessingCausalImpact({
//           brandId,
//           experimentStartDate,
//           experimentEndDate,
//           currentDate,
//           experimentPrimaryMetric,
//           experimentTargetUpliftPercent,
//           experimentId,
//           trainingStartDate,
//           trainingEndDate,
//           treatmentChildRegionIds,
//           adPlatform
//         })
//         // const {
//         //   brandId,
//         //   experimentStartDate,
//         //   experimentEndDate,
//         //   currentDate,
//         //   experimentPrimaryMetric,
//         //   experimentTargetUpliftPercent,
//         //   experimentId,
//         //   trainingStartDate,
//         //   trainingEndDate,
//         //   treatmentChildRegionIds,
//         //   adPlatform,
//         // } = job.data;
//         // await incrementalityAnalysisService.calculateAndSavePreTestAverageMetricsCausalImpact(
//         //   {
//         //     brandId,
//         //     experimentId,
//         //     trainingStartDate,
//         //     trainingEndDate,
//         //     treatmentChildRegionIds,
//         //     adPlatform,
//         //   },
//         // );

//         // // Run calculateCounterfactualDataCausalImpact if experiment has already started
//         // if (incrementalityAnalysisService.experimentStarted(experimentStartDate)) {
//         //   console.log("Experiment has already started");
//         //   await incrementalityAnalysisService.calculateCounterfactualDataCausalImpact(
//         //     {
//         //       brandId,
//         //       experimentId,
//         //       trainingStartDate,
//         //       trainingEndDate,
//         //       experimentStartDate,
//         //       today: getEarlierDate({
//         //         date1: currentDate,
//         //         date2: experimentEndDate,
//         //       }),
//         //       treatmentChildRegionIds,
//         //       primaryMetric: experimentPrimaryMetric,
//         //       adPlatform,
//         //       targetUpliftPercentage: experimentTargetUpliftPercent ?? 0,
//         //     },
//         //   );
//         // }
//         console.log(
//           "WORKER - Post-publish processing Causal Impact job completed",
//         );
//         //--------------------------------
//       } else if (job.name === JOB_TYPES.IA_CSV_UPLOAD_PIPELINE) {
//         console.log("WORKER - IA CSV Upload Pipeline job started");
//         const { brandId, storedFileName, countryId, dataCategory, trainingStartDate, trainingEndDate, experimentId } = job.data;
//         await s3IncrementalityAnalysisService.processCsvUploadPipeline({
//           brandId,
//           storedFileName,
//           countryId,
//           dataCategory,
//           trainingStartDate,
//           trainingEndDate,
//           experimentId,
//         });
//         console.log("WORKER - IA CSV Upload Pipeline job completed");
//         //--------------------------------
//       }
//       else {
//         console.log(
//           `WORKER - Skipping job ${job.id} as it's not available in recalculation jobs`,
//         );
//       }
//     } catch (error) {
//       console.error(`Error processing job ${job.id}:`, error);
//       logger.error(`Error processing job ${job.id}:`, error);
//       throw error; // Re-throw to trigger retry mechanism
//     }
//   },
//   {
//     connection: redisConnection,
//     concurrency: 2,
//     limiter: {
//       max: 10,
//       duration: 1000,
//     },
//     lockDuration: 300000, // 5 minutes lock duration
//     stalledInterval: 30000, // Check for stalled jobs every 30 seconds
//     maxStalledCount: 2, // Allow 2 stalled checks before marking as failed
//   },
// );

// worker.on("completed", (job) => {
//   console.log(`Job ${job.id} has completed`);
//   logger.info(`Job ${job.id} has completed`);
// });

// worker.on("failed", (job, err) => {
//   console.error(`Job ${job?.id} has failed with error ${err.message}`);
//   logger.error(`Job ${job?.id} has failed with error ${err.message}`, err);
// });

// worker.on("error", (err) => {
//   console.error("Worker error:", err);
//   logger.error("Worker error:", err);
// });

// worker.on("stalled", (jobId) => {
//   console.error(`Job ${jobId} has stalled`);
//   logger.error(`Job ${jobId} has stalled`);
// });

// // export * from "./onboarding.worker"; DO NOT ADD HERE OR ELSE BOTH WORKERS WILL PICK THE TASKS.
// // export * from "./timeout-demo.worker";
