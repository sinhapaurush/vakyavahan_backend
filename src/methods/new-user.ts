import { sha224, sha256 } from "js-sha256";
import { Client } from "../types/collection-schema";
import DBHandler, { CollectionName } from "./mongo";

interface NewUserData {
  name: string;
  organization: string;
  mail: string;
  password: string;
}

/**
 * @description Creates new user in the database
 * @author Paurush Sinha
 * @returns true if success
 * @param param0 name, organization, mail and password: all string
 */
export default async function createNewUser({
  name,
  organization,
  mail,
  password,
}: NewUserData): Promise<boolean> {
  const encryptedPassword = sha256(password).toString();

  let currentTime: number = new Date().valueOf();
  const randomNumber: number = Math.random();
  const doubleEncrypted = sha224(encryptedPassword).toString();
  const mailEncrypt = sha256(mail);
  const nameEncrypt = sha256(name);
  const randomTwo = Math.random();

  let authToken: string = `${currentTime}${randomNumber}${mailEncrypt}${nameEncrypt}`;
  authToken = sha224(sha256(authToken).toString()).toString();

  currentTime = new Date().valueOf();

  let clienttoken: string = `${randomNumber}${randomTwo}${currentTime}${nameEncrypt}${mailEncrypt}${encryptedPassword}`;
  clienttoken = sha224(
    sha256(sha224(`${clienttoken}${doubleEncrypted}`).toString()).toString()
  ).toString();

  const userData: Client = {
    name: name,
    organization: organization,
    mail: mail,
    password: encryptedPassword,
    socketid: null,
    authid: authToken,
    clienttoken: clienttoken,
  };

  const db = new DBHandler();

  const insertionResponse = await db.newDocument(
    CollectionName.client,
    userData
  );
  db.close();
  if (!insertionResponse) {
    return false;
  }
  return true;
}
