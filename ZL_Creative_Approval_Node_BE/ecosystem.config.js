module.exports = {
  apps: [
    {
      name: "bsd-api", // Main application
      script: "./dist/server.js",
      instances: 3, // "max" means use maximum number of CPU cores OR use number of instances as per CPU cores.
      exec_mode: "cluster", // Enable clustering for better performance using same port and load balancing Else it will only route all requests to the first instance and others remain unused. Creates multiple processes for each instance as per max CPU cores.
      autorestart: true,
      watch: false, // watches for changes in the code and restarts the server. Keep it false for production
      // node_args: "--max-old-space-size=4096", // Increase heap size to 4GB
      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
    {
      name: "bsd-worker-cron", // Cron jobs trigger only
      script: "./dist/cron/index.js",
      instances: 1, // Workers usually run on fewer instances.
      exec_mode: "fork", // Does not take advantage of multiple cores of CPU. Just runs one process per instance.
      autorestart: true,
      watch: false,
      // node_args: "--max-old-space-size=4096", // Increase heap size to 4GB
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "bsd-worker-jobs", // Recalculation jobs
      script: "./dist/jobs/workers/index.js",
      instances: 2, // Multiple workers compete for jobs from the same BullMQ queue.
      exec_mode: "fork", // Does not take advantage of multiple cores of CPU. Just runs one process per instance.
      autorestart: true,
      watch: false,
      // node_args: "--max-old-space-size=4096", // Increase heap size to 4GB
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "bsd-worker-onboarding", // Onboarding jobs
      script: "./dist/jobs/workers/onboarding.worker.js",
      instances: 1, // Onboarding workers run on single instance (sequential processing)
      exec_mode: "fork", // Does not take advantage of multiple cores of CPU. Just runs one process per instance.
      autorestart: true,
      watch: false,
      // node_args: "--max-old-space-size=4096", // Increase heap size to 4GB if needed for onboarding
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
