import type { Db } from 'mongodb';

const COUNTERS_COLLECTION = 'counters';

type CounterDocument = {
  _id: string;
  seq: number;
};

export async function getNextSequence(db: Db, name: string): Promise<number> {
  const counter = await db
    .collection<CounterDocument>(COUNTERS_COLLECTION)
    .findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' },
    );

  if (!counter) {
    throw new Error(`Failed to generate sequence for ${name}`);
  }

  return counter.seq;
}
