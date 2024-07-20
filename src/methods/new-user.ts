import { Db, InsertOneResult, MongoClient } from "mongodb";
import { CollectionName, DB_NAME, DB_URI } from "./mongo";
import { Client } from "../types/collection-schema";
import { sha224, sha256 } from "js-sha256";



/**
 * newUserSchema creates Document to store in the collection. It generates authid and clientid by itself.
 * @param name User Name
 * @param org Company Name
 * @param deviceid Device Id
 * @returns User document
 * @author Paurush Sinha
 */
function newUserSchema(name: string, org: string, deviceid: string): Client {
  const date: Date = new Date();
  const curtime: string = sha256(date.getTime().toString());
  const randomEnc = sha224(Math.random().toString());
  let authid: string = `${sha256(deviceid)}${curtime}${randomEnc}`;
  authid = sha224(sha256(authid));

  const randend = sha256(Math.ceil(Math.random() * Math.random()).toString());
  const newtime = sha224(new Date().getTime().toString());
  let clientId: string = `${randend}${newtime}${sha256(deviceid)}`;
  clientId = sha224(sha256(sha256(clientId)));
  const curtimefinal: number = new Date().getTime();
  return {
    authid: authid,
    clienttoken: clientId,
    lastconnection: curtimefinal,
    name: name,
    organization: org,
    deviceId: deviceid,
    socketid: null
  }
}


export interface NewUserProcessResponse {
  success: boolean;
  client?: Client;
}

/**
 * createNewUser function creates a new client in the database if the user is non existent
 * @param name Take name of the user 
 * @param org Take organisation name of the user
 * @param deviceid takes user's device id (IMEI of slot 1)
 * @author Paurush Sinha
 */
export async function createNewUser(name: string, org: string, deviceid: string): Promise<NewUserProcessResponse> {
  const connection: MongoClient = new MongoClient(DB_URI);
  const db: Db = connection.db(DB_NAME);
  const collection = db.collection(CollectionName.client);
  const result = await collection.findOne({ deviceId: deviceid });
  if (!result) {
    const userSchema: Client = newUserSchema(name, org, deviceid);
    try {
      const dbResult: InsertOneResult = await collection.insertOne(userSchema);
      if (dbResult.acknowledged) {
        return {
          success: true,
          client: userSchema
        };
      } else {
        return {
          success: false,
          client: undefined,
        }
      }
    } catch (e) {
      return {
        success: false,
        client: undefined,
      }
    }
  } else {
    return {
      success: false,
      client: undefined,
    }
  }

}