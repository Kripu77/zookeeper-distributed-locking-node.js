import { initLogging, logger } from "./helpers";
import { checkState } from "./infrastructure/zookeepeerRepo";
import {
  initMongo,
  initZookeeperConnection,
  createZNode,
  getPartition,
  getDocumentsBasedOnPartition,
} from "./infrastructure";

async function main() {
  initLogging();
  initMongo();
  initZookeeperConnection();
  await createZNode();


  setInterval(async()=>{
    const partition = await getPartition();
    const docs = await getDocumentsBasedOnPartition(
      partition.startIndex,
      partition.endIndex
    );
    logger.info({
      docs: docs,
    });
  }, 10000)


 
}

main().catch((err) => {
  logger.error("An error occurred:", err);
});
