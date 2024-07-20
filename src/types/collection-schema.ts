import { ObjectId } from "mongodb";

export interface Client {
  _id?: ObjectId;
  name: string;
  organization: string;
  deviceId: string;
  socketid: string | null;
  authid: string;
  clienttoken: string;
  lastconnection: number;
}

export interface Message {
  _id?: ObjectId;
  message: string;
  from: ObjectId;
  to: string;
  timestamp: number;
}
