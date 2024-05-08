import { Partition } from "./Partition";
import { Record } from "./Record";

export type GetDocumentsBasedOnPartition = (
  startIndex: number,
  endIndex: number
) => Promise<Record[]>;

export type GetTotalDocumentsCount = () => Promise<Record>;

export type GetPartition = () => Promise<Partition>;
