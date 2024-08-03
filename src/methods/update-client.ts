import { Collection, Db, MongoClient, UpdateResult } from "mongodb";
import { CollectionName, DB_NAME, DB_URI } from './mongo';

/**
 * This function is updating name and org name mapped with respective auth and client key in the database
 * @param name string
 * @param org string
 * @param auth string
 * @param client string
 * @author Paurush Sinha
 */
export default async function updateClient(name: string, org: string, auth: string, client: string): Promise<boolean> {
    const connection: MongoClient = new MongoClient(DB_URI);
    const db: Db = connection.db(DB_NAME);
    const collection: Collection = db.collection(CollectionName.client);
    const ack: UpdateResult = await collection.updateOne({ authid: auth, clienttoken: client }, { $set: { name: name, organization: org } });
    if (ack.acknowledged) {
        return true;
    }
    return false;
}