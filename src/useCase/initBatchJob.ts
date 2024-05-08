import { logger } from "@/helpers";
import { GetDocumentsBasedOnPartition, GetPartition } from "@/models";
import cron from "node-cron";

const cronExpression = "*/10 * * * * *";

async function Job(
  getPartition: GetPartition,
  getDocumentsBasedOnPartition: GetDocumentsBasedOnPartition
): Promise<void> {
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
  getPartition: GetPartition,
  getDocumentsBasedOnPartition: GetDocumentsBasedOnPartition
) {
  logger.info({ message: "Setting up cron event handler........" });

  cron.schedule(cronExpression, async () => {
    await Job(getPartition, getDocumentsBasedOnPartition);
  });
}
