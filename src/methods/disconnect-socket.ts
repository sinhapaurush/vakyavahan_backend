import DBHandler, { CollectionName } from "./mongo";

/**
 * Deletes socketid and removes it from database to redundant deletion.
 * @param socketid socketid string
 * @author Paurush Sinha
 */
export default async function disconnectSocketFromDataBase(
  socketid: string
): Promise<boolean> {
  const db = new DBHandler();
  const response: boolean = await db.updateRecord(
    CollectionName.client,
    { socketid: socketid },
    { socketid: null },
    true
  );
  return response;
}
