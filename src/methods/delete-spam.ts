import DBHandler, { CollectionName } from "./mongo";

const WEEK_LENGTH: number = 604800000;

/**
 * Calculates Last Week Ago millisecond
 * @returns Miliseconds that was exactly one week ago
 */
function calculateLastEpoch() {
  return new Date().valueOf() - WEEK_LENGTH;
}

/**
 * Deletes Clients that are unused for more that a week.
 */
export default function deleteSpamClients() {
  const db: DBHandler = new DBHandler();

  const lastEpoch: number = calculateLastEpoch();

  db.deleteMultipleRecords(
    CollectionName.client,
    {
      socketid: null,
      lastconnection: { $lt: lastEpoch },
    },
    true
  );
}

// Scheduler to delete clients
export function deleteUnusedAccountsEveryWeek() {
  setInterval(() => {
    deleteSpamClients();
  }, WEEK_LENGTH);
}
