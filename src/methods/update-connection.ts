import DBHandler, { CollectionName } from "./mongo";

/**
 * Updates socketid in relavent document in DB
 * @param clienttoken Token Provided to the client for the interaction
 * @param auth Auth ID for API, is also provided to the client
 * @param socketid New Socket ID Generated
 * @returns true if success
 * @author Paurush Sinha
 */
export default async function addSocketIDinDB(
  clienttoken: string,
  auth: string,
  socketid: string
) {
  const db = new DBHandler();
  let acknowledgement: boolean = false;
  try {
    acknowledgement = await db.updateRecord(
      CollectionName.client,
      { clienttoken: clienttoken, authid: auth },
      { socketid: socketid },
      true
    );
  } catch {
    console.log("SOMETHING WENT WRONG");
  }
  return acknowledgement;
}
