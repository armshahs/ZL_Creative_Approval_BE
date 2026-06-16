import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { config } from "../config";
import moment from "moment-timezone";

// Initialize Logtail
const logtail = new Logtail(config.logging.logtailToken, {
  endpoint: config.logging.logtailEndpoint,
});

const logLevels = {
  error: 0, // highest priority
  warning: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: config.logging.logLevel,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: () =>
        moment()
          .tz("Australia/Melbourne")
          .format("YYYY-MM-DD HH:mm:ss.SSS [AEST]"),
    }),
    winston.format.json(),
    // To print to console in a particular format unhide below code and hide winston.format.json()
    // winston.format.printf(
    //   ({ timestamp, level, message, logMetadata, stack }) => {
    //     return `${timestamp} ${level}: ${logMetadata || ""} ${message} ${stack || ""}`;
    //   },
    // ),
  ),
  transports: [
    new winston.transports.Console(), // AWS logs to cloudwatch
    new LogtailTransport(logtail), // Logtail cloud logging
  ],
});

// For saving the logs as a file (includes daily rotation)
const fileRotateTransport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
});
logger.add(fileRotateTransport);

// Flush logs before exiting (it means that when the nodejs is about to shutdown all logs should get sent to the cloud before shutdown)
process.on("beforeExit", async () => {
  await logtail.flush();
});

export default logger;
