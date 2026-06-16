import "reflect-metadata";
import { AppDataSource } from "./database";
import app from "./app";
import { config } from "./config";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(config.server.port, () =>
      console.log(`Server running on port ${config.server.port}`),
    );
    // Add logging
    // logger.info(`Server running on port ${config.server.port}`);
  })
  .catch((error) => console.log(error));
