import { logger } from "@/helpers";
import { Record } from "@/models";
import { MongoClient } from "mongodb";

let mongoClient: MongoClient;

const connectionString = "mongodb://root:root@mongo:27017";
const db = "sample_db";
const collection = "sample_collection";

export async function initMongo(): Promise<void> {
  mongoClient = new MongoClient(connectionString);
  await mongoClient.connect();
}

export async function getTotalDocumentsCount(): Promise<Record> {
  try {
    const recordsCollection = mongoClient.db(db).collection<Record>(collection);
    return recordsCollection.countDocuments();
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
): Promise<Record[]> {
  try {
    const recordsCollection = mongoClient.db(db).collection<Record>(collection);

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
