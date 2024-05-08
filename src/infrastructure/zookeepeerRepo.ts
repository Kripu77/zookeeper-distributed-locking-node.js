import { logger } from "@/helpers";
import zookeeper, { Event } from "node-zookeeper-client";
import { getTotalDocumentsCount } from "./mongoRepo";

const client = zookeeper.createClient("zookeeper:2181", {
  sessionTimeout: 9000,
  spinDelay: 1000,
  retries: 3,
});

type Client = typeof client;

let instanceId: number;
let runningInstanceId: number;
let totalInstances: number;

const root = "/microservices";
const path = `${root}/workload-`;

export function initZookeeperConnection() {
  client.connect();
}

export async function createZNode() {
  return new Promise((resolve, reject) => {
    client.once("connected", () => {
      logger.info("Client connected to Zookeeper Server.......");

      client.mkdirp(root, (err, _) => {
        if (err) {
          logger.error({ err });
          reject(err);
        } else {
          logger.info("Parent node created or already exists:", root);
          createChildNode().then(resolve).catch(reject);
        }
      });
    });
  });
}

export async function createChildNode() {
  return new Promise<void>((resolve, reject) => {
    client.create(
      path,
      zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL,
      (err, createdPath) => {
        if (err) {
          logger.error({ err });
          reject(err);
        } else {
          instanceId = parseInt(createdPath.split("-")[1], 10);
          logger.info({ path: createdPath, instanceId });
          checkState();
          resolve();
        }
      }
    );
  });
}

export function checkState() {
  return client.on("state", (state) => {
    logger.info(state);
    if (state === zookeeper.State.SYNC_CONNECTED) {
      logger.info("Client state is changed to connected.");
    }

    if (state === zookeeper.State.EXPIRED) {
      logger.info("Client state expired");
    }
  });
}

export async function getPartition() {
  await getChildren(client, root);
  const count = await getTotalDocumentsCount();

  if (count < 1) return;

  const partitionSize = Math.floor(count / totalInstances);
  const remainder = count % totalInstances;
  let startIndex = (runningInstanceId - 1) * partitionSize;
  let endIndex = startIndex + partitionSize - 1;
  if (runningInstanceId === totalInstances) {
    endIndex += remainder;
  }
  logger.debug(
    `I am instance ${runningInstanceId}, processing documents from index ${startIndex} to ${endIndex}`
  );
  return {
    startIndex,
    endIndex,
  };
}

export async function getChildren(client: Client, path: string) {
  return new Promise<void>((resolve, reject) => {
    client.getChildren(
      path,
      (event: Event) => {
        logger.info({ message: "Received event: %s", event: event });

        // getChildren(client, path); -> Not necessary if the service runs on a cron job
      },
      (error, children) => {
        if (error) {
          logger.error(`Failed to list children of ${path} due to: ${error}`);
          reject(error);
        } else {
          totalInstances = children.length;
          children.forEach((child, index) => {
            const childId = parseInt(child.split("-")[1], 10);
            if (childId === instanceId) {
              runningInstanceId = index + 1;
            }
          });
          resolve();
        }
      }
    );
  });
}
