import { logger } from "@/helpers";
import cron from "node-cron";

const cronExpression = "*/10 * * * * *";

interface Partition {
  startIndex: number;
  endIndex: number;
}
type GetPartition = () => Promise<Partition>;

async function Job(getPartition: any, getDocumentsBasedOnPartition: any) {
  const partition = await getPartition();
  const docs = await getDocumentsBasedOnPartition(
    partition.startIndex,
    partition.endIndex
  );
  logger.info({
    docs: docs,
  });
}

export async function setupBatchJob(
  getPartition: any,
  getDocumentsBasedOnPartition: any
) {
  logger.info({ message: "Setting up cron event handler" });

  cron.schedule(cronExpression, async () => {
    await Job(getPartition, getDocumentsBasedOnPartition);
  });
}
