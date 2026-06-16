import "reflect-metadata";
import { AppDataSource } from "./database";
import app from "./app";
import { config } from "./config";
import { logger } from "./utils";
// import { initializeCrons } from "./cron";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    // // Initialize crons after DB is ready
    // initializeCrons();
    // console.log("Crons started");
    app.listen(config.server.port, () =>
      console.log(`Server running on port ${config.server.port}`)
    );
    // Add logging
    logger.info(`Server running on port ${config.server.port}`);
  })
  .catch((error) => console.log(error));
// .catch((error) => {
//   app.listen(config.server.port, () =>
//     console.log(`Server running on port ${config.server.port}`)
//   );
//   console.log(error);
// });
