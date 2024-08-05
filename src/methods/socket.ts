import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import disconnectSocketFromDataBase from "./disconnect-socket";
import addSocketIDinDB from "./update-connection";
import fetchSocketId from "./fetch-socket";
import { MessageEnvalope } from "../types/message";

export function socketHandler(server: HTTPServer): void {
  const io: Server = new Server(server);
  io.on("connection", () => {});
}

export default class SocketHandler {
  io: Server;

  private disconnectSocketFromDB(socketid: string) {
    disconnectSocketFromDataBase(socketid);
  }

  private initializeSocket() {
    this.io.on("connection", (socket: Socket) => {
      console.log(socket.id);
      let gotCredential: boolean = false;
      socket.on("credentials", async (cred: string) => {
        try {
          const credentials = JSON.parse(cred);
          if (credentials.client && credentials.auth) {
            gotCredential = true;
            const successInInsertion: boolean = await addSocketIDinDB(
              credentials.client,
              credentials.auth,
              socket.id
            );
            if (!successInInsertion) {
              socket.disconnect();
            }
          } else {
            this.disconnectSocketFromDB(socket.id);
            socket.disconnect();
          }
        } catch (e) {
          socket.disconnect();
        }
      });
      setTimeout(() => {
        if (!gotCredential) socket.disconnect();
      }, 10000);
      socket.on("disconnect", () => {
        this.disconnectSocketFromDB(socket.id);
      });
    });
  }

  async sendSMSviaSocket(
    authid: string,
    target: string,
    body: string
  ): Promise<boolean> {
    try {
      const socketID = await fetchSocketId(authid);
      if (!socketID) {
        return false;
      }
      const messageData: MessageEnvalope = {
        message: body,
        to: target,
      };
      this.io.to(socketID).emit("sendsms", messageData);
      return true;
    } catch {
      return false;
    }
  }
  constructor(server: HTTPServer) {
    this.io = new Server(server);
    this.initializeSocket();
  }
}
