import { sha224, sha256 } from "js-sha256";
import { Client } from "../types/collection-schema";
import DBHandler, { CollectionName } from "./mongo";

interface NewUserData {
  name: string;
  organization: string;
  deviceId: string;
  password: string;
}

function createClientDocument(
  name: string,
  deviceId: string,
  password: string,
  organization: string
): Client {
  const encryptedPassword = sha256(password).toString();

  let currentTime: number = new Date().valueOf();
  const randomNumber: number = Math.random();
  const doubleEncrypted = sha224(encryptedPassword).toString();
  const deviceIdEncrypt = sha256(deviceId);
  const nameEncrypt = sha256(name);
  const randomTwo = Math.random();

  let authToken: string = `${currentTime}${randomNumber}${deviceIdEncrypt}${nameEncrypt}`;
  authToken = sha224(sha256(authToken).toString()).toString();

  currentTime = new Date().valueOf();

  let clienttoken: string = `${randomNumber}${randomTwo}${currentTime}${nameEncrypt}${deviceIdEncrypt}${encryptedPassword}`;
  clienttoken = sha224(
    sha256(sha224(`${clienttoken}${doubleEncrypted}`).toString()).toString()
  ).toString();

  const userData: Client = {
    name: name,
    organization: organization,
    deviceId: deviceId,
    password: encryptedPassword,
    socketid: null,
    authid: authToken,
    clienttoken: clienttoken,
    lastconnection: new Date().valueOf(),
  };
  return userData;
}

/**
 * @description Creates new user in the database
 * @author Paurush Sinha
 * @returns true if success
 * @param param0 name, organization, deviceId and password: all string
 */
export default async function createNewUser({
  name,
  organization,
  deviceId,
  password,
}: NewUserData): Promise<boolean> {
  const db = new DBHandler();
  const result = await db.select(CollectionName.client, { deviceId: deviceId });
  if (!result) {
    const userData: Client = createClientDocument(
      name,
      deviceId,
      password,
      organization
    );
    const insertionResponse = await db.newDocument(
      CollectionName.client,
      userData
    );
    db.close();
    if (!insertionResponse) {
      return false;
    }
    return true;
  } else {
    const userData: Client = createClientDocument(
      name,
      deviceId,
      password,
      organization
    );
    db.updateRecord(CollectionName.client, { deviceId: deviceId }, userData);
    db.close();
    return false;
  }
}
