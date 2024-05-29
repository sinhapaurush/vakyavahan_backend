import DBHandler, { CollectionName } from "./mongo";

/**
 * @author Paurush Sinha
 * @param authtoken Authtoken (string).
 * @description Takes authtoken and returns related available socket ID.
 */
export default async function fetchSocketId(
  authtoken: string
): Promise<string | null> {
  const db = new DBHandler();
  try {
    const result = await db.select(
      CollectionName.client,
      { authid: authtoken },
      true
    );
    if (!result) {
      return null;
    } else {
      return result.socketid;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}
