import { initLogging, logger } from "./helpers";
import {
  initMongo,
  initZookeeperConnection,
  createZNode,
  getPartition,
  getDocumentsBasedOnPartition,
} from "./infrastructure";
import { setupBatchJob } from "./useCase";

async function main() {
  initLogging();
  initMongo();
  initZookeeperConnection();
  await createZNode();
  await setupBatchJob(getPartition, getDocumentsBasedOnPartition);
}

main().catch((err) => {
  logger.error("An error occurred:", err);
});
