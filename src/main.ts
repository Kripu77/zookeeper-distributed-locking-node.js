import { initLogging, logger } from "./helpers";
import {
  initMongo,
  initZookeeperConnection,
  createZNode,
  getPartition,
} from "./infrastructure";

async function main() {
  initLogging();
  initMongo();
  initZookeeperConnection();
  await createZNode();
  await getPartition();
  setInterval(getPartition, 10000);
}

main().catch((err) => {
  logger.error("An error occurred:", err);
});
