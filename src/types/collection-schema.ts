import { ObjectId } from "mongodb";

export interface Client {
  _id?: ObjectId;
  name: string;
  organization: string;
  mail: string;
  password: string;
  socketid: string | null;
  authid: string;
  clienttoken: string;
}

export interface Message {
  _id?: ObjectId;
  message: string;
  from: ObjectId;
  to: string;
  timestamp: Date;
}
