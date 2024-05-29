import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

export default function socketHandler(server: HTTPServer): void {
  const io: Server = new Server(server);

  io.on("connection", () => {});
}
