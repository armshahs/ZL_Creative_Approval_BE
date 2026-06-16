// import { recalculationQueue, onboardingQueue } from "../queues";
// import { IaV1CsvDataCategory } from "../../config/constants";

// // Define job types as constants
// export const JOB_TYPES = {
//   UE_RECALCULATION: "ue-recalculation",
//   RM_RECALCULATION: "rm-recalculation",
//   ADJUSTMENTS_RECALCULATION: "adjustments-recalculation",
//   SEASONALITY_RECALCULATION: "seasonality-recalculation",
//   COHORT_RC_ANALYSIS_RECALCULATION: "cohort-rc-analysis-recalculation",
//   SALES_CHANNEL_RECALCULATION: "sales-channel-recalculation",
//   SHIPPING_ADDRESS_COUNTRY_CODE_RECALCULATION:
//     "shipping-address-country-code-recalculation",
//   AD_ACCOUNTS_RECALCULATION: "ad-accounts-recalculation",
//   DATA_INGESTION_CRON: "data-ingestion-cron",
//   MARKETING_EVENT_RECALCULATION: "marketing-event-recalculation",
//   RC_COHORT_GENERATION_CRON: "rc-cohort-generation-cron",
//   BSD_INDEX_CRON: "bsd-index-cron",
//   SAMPLE_CPU_INTENSIVE_JOB: "sample-cpu-intensive-job",
//   BRAND_ONBOARDING_CRON: "brand-onboarding-cron",
//   AI_SUMMARY_GENERATION_CRON: "ai-summary-generation",
//   META_DATA_UPDATE_CRON: "meta-data-update-cron",
//   GOOGLE_DATA_UPDATE_CRON: "google-data-update-cron",
//   TIKTOK_DATA_UPDATE_CRON: "tiktok-data-update-cron",
//   POD_SYNC_DJANGO_API: "pod-sync-django-api",
//   SHOPIFY_SALES_CHANNEL_UPDATE_CRON: "shopify-sales-channel-update-cron",
//   TEST_RECALCULATION_JOB: "test-recalculation-job",
//   TEST_ONBOARDING_JOB: "test-onboarding-job",
//   META_REGION_SPLIT_DATA_UPDATE_CRON: "meta-region-split-data-update-cron",
//   GOOGLE_REGION_SPLIT_DATA_UPDATE_CRON: "google-region-split-data-update-cron",
//   INCREMENTALITY_DATA_UPDATE_CRON: "incrementality-data-update-cron",
//   INCREMENTALITY_DIF_IN_DIF_CRON: "incrementality-dif-in-dif-cron",
//   INCREMENTALITY_CAUSAL_IMPACT_CRON: "incrementality-causal-impact-cron",
//   // CALCULATE_PRE_TEST_AVERAGE_METRICS_DIF_IN_DIF:
//   //   "calculate-pre-test-average-metrics-dif-in-dif",
//   // CALCULATE_PRE_TEST_AVERAGE_METRICS_CAUSAL_IMPACT:
//   //   "calculate-pre-test-average-metrics-causal-impact",
//   MONDAY_SLACK_MESSAGES_CRON: "monday-slack-messages-cron",
//   POST_PUBLISH_PROCESSING_DIF_IN_DIF: "post-publish-processing-dif-in-dif",
//   POST_PUBLISH_PROCESSING_CAUSAL_IMPACT: "post-publish-processing-causal-impact",
//   IA_CSV_UPLOAD_PIPELINE: "ia-csv-upload-pipeline",
// } as const;

// // ================================================================================
// // 1. Onboarding Queue Producers
// // ================================================================================

// export class OnboardingProducer {
//   // Brand Onboarding Cron job
//   static async addBrandOnboardingCronJob() {
//     console.log("PRODUCE - Adding Brand Onboarding Cron job -onboarding queue");
//     await onboardingQueue.add(JOB_TYPES.BRAND_ONBOARDING_CRON, {});
//   }

//   // Test Job - runs for 30 seconds
//   static async addTestOnboardingJob() {
//     console.log("PRODUCE - Adding Test Onboarding Job - onboarding queue");
//     await onboardingQueue.add(JOB_TYPES.TEST_ONBOARDING_JOB, {});
//   }
// }

// // ================================================================================
// // 2. Recalculation Queue Producers
// // ================================================================================

// export class RecalculationProducer {
//   static async addUeRecalculationJob(brandId: string, year: number) {
//     console.log("PRODUCE - Adding UE recalculation job");
//     await recalculationQueue.add(JOB_TYPES.UE_RECALCULATION, {
//       brandId,
//       year,
//     });
//   }

//   static async addRmRecalculationJob(brandId: string, year: number) {
//     console.log("PRODUCE - Adding RM recalculation job");
//     await recalculationQueue.add(JOB_TYPES.RM_RECALCULATION, {
//       brandId,
//       year,
//     });
//   }

//   static async addAdjustmentsRecalculationJob(brandId: string, year: number) {
//     console.log("PRODUCE - Adding Adjustments recalculation job");
//     await recalculationQueue.add(JOB_TYPES.ADJUSTMENTS_RECALCULATION, {
//       brandId,
//       year,
//     });
//   }

//   static async addSeasonalityRecalculationJob(brandId: string, year: number) {
//     console.log("PRODUCE - Adding Seasonality recalculation job");
//     await recalculationQueue.add(JOB_TYPES.SEASONALITY_RECALCULATION, {
//       brandId,
//       year,
//     });
//   }

//   static async addCohortRcAnalysisRecalculationJob(
//     brandId: string,
//     year: number,
//   ) {
//     console.log("PRODUCE - Adding Cohort RC analysis recalculation job");
//     await recalculationQueue.add(JOB_TYPES.COHORT_RC_ANALYSIS_RECALCULATION, {
//       brandId,
//       year,
//     });
//   }

//   static async addSalesChannelRecalculationJob(brandId: string) {
//     console.log("PRODUCE - Adding Sales Channel recalculation job");
//     await recalculationQueue.add(JOB_TYPES.SALES_CHANNEL_RECALCULATION, {
//       brandId,
//     });
//   }

//   static async addShippingAddressCountryCodeRecalculationJob(brandId: string) {
//     console.log(
//       "PRODUCE - Adding Shipping Address Country Code recalculation job",
//     );
//     await recalculationQueue.add(
//       JOB_TYPES.SHIPPING_ADDRESS_COUNTRY_CODE_RECALCULATION,
//       {
//         brandId,
//       },
//     );
//   }

//   static async addAdAccountsRecalculationJob(brandId: string) {
//     console.log("PRODUCE - Adding Ad Accounts recalculation job");
//     await recalculationQueue.add(JOB_TYPES.AD_ACCOUNTS_RECALCULATION, {
//       brandId,
//     });
//   }

//   static async addDataIngestionCronJob(brandIds: string[]) {
//     if (brandIds.length === 0) return;
//     console.log(
//       `PRODUCE - Adding Data Ingestion Cron job for ${brandIds.length} brand(s)`,
//     );
//     await recalculationQueue.add(JOB_TYPES.DATA_INGESTION_CRON, { brandIds });
//   }

//   static async addMarketingEventRecalculationJob(
//     brandId: string,
//     year: number,
//   ) {
//     console.log("PRODUCE - Adding Marketing Event recalculation job");
//     await recalculationQueue.add(JOB_TYPES.MARKETING_EVENT_RECALCULATION, {
//       brandId,
//       year,
//     });
//   }

//   // RC cohort generation cron job - monthly cron
//   static async addRcCohortGenerationCronJob(
//     timePeriod: "prevMonth" | "maxMonths",
//   ) {
//     console.log("PRODUCE - Adding RC Cohort Generation Cron job");
//     await recalculationQueue.add(JOB_TYPES.RC_COHORT_GENERATION_CRON, {
//       timePeriod,
//     });
//   }

//   // BSD Index cron job
//   static async addBsdIndexCronJob() {
//     console.log("PRODUCE - Adding BSD Index Cron job");
//     await recalculationQueue.add(JOB_TYPES.BSD_INDEX_CRON, {});
//   }

//   // Sample CPU Intensive Job
//   static async addSampleCpuIntensiveJob() {
//     console.log("PRODUCE - Adding Sample CPU Intensive Job");
//     await recalculationQueue.add(JOB_TYPES.SAMPLE_CPU_INTENSIVE_JOB, {});
//   }

//   // Brand Onboarding Cron job - MOVED to OnboardingProducer

//   // AI Summary Generation Cron job
//   static async addAiSummaryGenerationCronJob() {
//     console.log("PRODUCE - Adding AI Summary Generation Cron job");
//     await recalculationQueue.add(JOB_TYPES.AI_SUMMARY_GENERATION_CRON, {});
//   }

//   // Meta Data Update Cron job
//   static async addMetaDataUpdateCronJob() {
//     console.log("PRODUCE - Adding Meta Data Update Cron job");
//     await recalculationQueue.add(JOB_TYPES.META_DATA_UPDATE_CRON, {});
//   }

//   // Google Data Update Cron job
//   static async addGoogleDataUpdateCronJob() {
//     console.log("PRODUCE - Adding Google Data Update Cron job");
//     await recalculationQueue.add(JOB_TYPES.GOOGLE_DATA_UPDATE_CRON, {});
//   }

//   // Tiktok Data Update Cron job
//   static async addTiktokDataUpdateCronJob() {
//     console.log("PRODUCE - Adding Tiktok Data Update Cron job");
//     await recalculationQueue.add(JOB_TYPES.TIKTOK_DATA_UPDATE_CRON, {});
//   }

//   // Pod Sync Django API
//   static async addPodSyncDjangoApiJob() {
//     console.log("PRODUCE - Adding Pod Sync Django API job");
//     await recalculationQueue.add(JOB_TYPES.POD_SYNC_DJANGO_API, {});
//   }

//   // Shopify Sales Channel Update Cron job
//   static async addShopifySalesChannelUpdateCronJob(
//     channelStatusDefault: boolean,
//   ) {
//     console.log("PRODUCE - Adding Shopify Sales Channel Update Cron job");
//     await recalculationQueue.add(JOB_TYPES.SHOPIFY_SALES_CHANNEL_UPDATE_CRON, {
//       channelStatusDefault,
//     });
//   }

//   // Test Job - runs for 30 seconds
//   static async addTestRecalculationJob() {
//     console.log("PRODUCE - Adding Test Recalculation Job");
//     await recalculationQueue.add(JOB_TYPES.TEST_RECALCULATION_JOB, {});
//   }

//   // Meta Region split data update cron job
//   static async addMetaRegionSplitDataUpdateCronJob() {
//     console.log("PRODUCE - Adding Meta Region split data update cron job");
//     await recalculationQueue.add(JOB_TYPES.META_REGION_SPLIT_DATA_UPDATE_CRON, {});
//   }

//   // Google Region split data update cron job
//   static async addGoogleRegionSplitDataUpdateCronJob() {
//     console.log("PRODUCE - Adding Google Region split data update cron job");
//     await recalculationQueue.add(JOB_TYPES.GOOGLE_REGION_SPLIT_DATA_UPDATE_CRON, {});
//   }

//   // Incrementality data update cron job
//   static async addIncrementalityDataUpdateCronJob() {
//     console.log("PRODUCE - Adding Incrementality data update cron job");
//     await recalculationQueue.add(JOB_TYPES.INCREMENTALITY_DATA_UPDATE_CRON, {});
//   }

//   // Incrementality Dif-in-Dif cron job
//   static async addIncrementalityDifInDifCronJob() {
//     console.log("PRODUCE - Adding Incrementality Dif-in-Dif cron job");
//     await recalculationQueue.add(JOB_TYPES.INCREMENTALITY_DIF_IN_DIF_CRON, {});
//   }

//   // Incrementality Causal Impact cron job
//   static async addIncrementalityCausalImpactCronJob() {
//     console.log("PRODUCE - Adding Incrementality Causal Impact cron job");
//     await recalculationQueue.add(JOB_TYPES.INCREMENTALITY_CAUSAL_IMPACT_CRON, {});
//   }

//   // // Calculate and save pre-test average metrics Dif-in-Dif (from experiment creation)
//   // static async addCalculatePreTestAverageMetricsDifInDifJob(payload: {
//   //   brandId: string;
//   //   experimentStartDate: string;
//   //   experimentEndDate: string;
//   //   currentDate: string;
//   //   experimentPrimaryMetric: string;
//   //   experimentTargetUpliftPercent: number | undefined;
//   //   experimentId: string;
//   //   trainingStartDate: string;
//   //   trainingEndDate: string;
//   //   controlChildRegionIds: string[];
//   //   treatmentChildRegionIds: string[];
//   //   adPlatform: string;
//   // }) {
//   //   console.log(
//   //     "PRODUCE - Adding Calculate Pre-Test Average Metrics Dif-in-Dif job",
//   //   );
//   //   await recalculationQueue.add(
//   //     JOB_TYPES.CALCULATE_PRE_TEST_AVERAGE_METRICS_DIF_IN_DIF,
//   //     payload,
//   //   );
//   // }

//   // Calculate and save pre-test average metrics Causal Impact (from experiment creation)
//   static async addMondaySlackMessagesCronJob(
//     brandIds: string[],
//     weekToCalculate: "current" | "previous" = "previous",
//   ) {
//     console.log(
//       `PRODUCE - Adding Monday Slack messages cron job for ${brandIds.length} brand(s)`,
//     );
//     await recalculationQueue.add(JOB_TYPES.MONDAY_SLACK_MESSAGES_CRON, {
//       brandIds,
//       weekToCalculate,
//     });
//   }

//   // static async addCalculatePreTestAverageMetricsCausalImpactJob(payload: {
//   //   brandId: string;
//   //   experimentStartDate: string;
//   //   experimentEndDate: string;
//   //   currentDate: string;
//   //   experimentPrimaryMetric: string;
//   //   experimentTargetUpliftPercent: number | undefined;
//   //   experimentId: string;
//   //   trainingStartDate: string;
//   //   trainingEndDate: string;
//   //   treatmentChildRegionIds: string[];
//   //   adPlatform: string;
//   // }) {
//   //   console.log(
//   //     "PRODUCE - Adding Calculate Pre-Test Average Metrics Causal Impact job",
//   //   );
//   //   await recalculationQueue.add(
//   //     JOB_TYPES.CALCULATE_PRE_TEST_AVERAGE_METRICS_CAUSAL_IMPACT,
//   //     payload,
//   //   );
//   // }

//   // Post-publish processing Dif-in-Dif
//   static async addPostPublishProcessingDifInDifJob(payload: {
//     brandId: string;
//     experimentStartDate: string;
//     experimentEndDate: string;
//     currentDate: string;
//     experimentPrimaryMetric: string;
//     experimentTargetUpliftPercent: number | undefined;
//     experimentId: string;
//     trainingStartDate: string;
//     trainingEndDate: string;
//     controlChildRegionIds: string[];
//     treatmentChildRegionIds: string[];
//     adPlatform: string;
//   }) {
//     console.log(
//       "PRODUCE - Adding Post-publish processing Dif-in-Dif job",
//     );
//     await recalculationQueue.add(
//       JOB_TYPES.POST_PUBLISH_PROCESSING_DIF_IN_DIF,
//       payload,
//     );
//   }

//   // Post-publish processing Causal Impact
//   static async addPostPublishProcessingCausalImpactJob(payload: {
//     brandId: string;
//     experimentStartDate: string;
//     experimentEndDate: string;
//     currentDate: string;
//     experimentPrimaryMetric: string;
//     experimentTargetUpliftPercent: number | undefined;
//     experimentId: string;
//     trainingStartDate: string;
//     trainingEndDate: string;
//     treatmentChildRegionIds: string[];
//     adPlatform: string;
//   }) {
//     console.log(
//       "PRODUCE - Adding Post-publish processing Causal Impact job",
//     );
//     await recalculationQueue.add(
//       JOB_TYPES.POST_PUBLISH_PROCESSING_CAUSAL_IMPACT,
//       payload,
//     );
//   }

//   // IA CSV Upload Pipeline
//   static async addCsvUploadPipelineJob(payload: {
//     brandId: string;
//     storedFileName: string;
//     countryId: string;
//     dataCategory: IaV1CsvDataCategory;
//     trainingStartDate: string;
//     trainingEndDate: string;
//     experimentId?: string;
//   }) {
//     console.log(
//       "PRODUCE - Adding IA CSV Upload Pipeline job",
//     );
//     await recalculationQueue.add(
//       JOB_TYPES.IA_CSV_UPLOAD_PIPELINE,
//       payload,
//     );
//   }
// }

// // export * from "./timeout-demo.producer";
