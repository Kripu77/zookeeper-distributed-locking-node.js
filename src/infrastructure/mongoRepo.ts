import { logger } from "@/helpers";
import { MongoClient } from "mongodb";

let mongoClient: MongoClient;

const connectionString = "mongodb://root:root@mongo:27017";
const collection = "collection";

export async function initMongo() {
  mongoClient = new MongoClient(connectionString);
  await mongoClient.connect();
}

export async function getTotalDocumentsCount() {
  try {
    const recordsCollection = mongoClient.db().collection<any>(collection);
    recordsCollection.countDocuments();
  } catch (err) {
    logger.error({
      error:
        "Failed to retrieve the total count of documents available in the collection.....",
      errorMessage: err.message,
    });
    throw new Error(err.message);
  }
}

export async function getDocumentsBasedOnPartition(
  startIndex: number,
  endIndex: number
): Promise<any[]> {
  try {
    const recordsCollection = mongoClient.db().collection<any>(collection);

    const docs = await recordsCollection
      .find()
      .skip(startIndex)
      .limit(endIndex - startIndex + 1)
      .toArray();

    return docs;
  } catch (err: any) {
    logger.error({
      error: "Failed to get all the documents.....",
      errorMessage: err.message,
    });
    throw new Error(err.message);
  }
}
