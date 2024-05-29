/**
 * @author Paurush Sinha
 */
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http, { Server as HTTPServer } from "http";
import { router as sendSMSRouter } from "./send-sms";
import { router as newClientRouter } from "./new-client";
import SocketHandler from "./methods/socket";
import { deleteUnusedAccountsEveryWeek } from "./methods/delete-spam";

// CONFIGURING .env
dotenv.config();
const PORT = process.env.PORT || 3000;

// INITIALIZING EXPRESS
const app: Express = express();
const server: HTTPServer = http.createServer(app);

// INVOKING SOCKET HANDLER FROM EXTERNAL FILE
export const wsObject = new SocketHandler(server);

// CONFIGURING EXTERNAL ROUTES
app.use(sendSMSRouter);
app.use(newClientRouter);

// NOT FOUND ROUTE
app.get("*", (req: Request, res: Response) => {
  res.statusCode = 404;
  res.json({ status: 404, message: "Invalid Request" });
});

// RUNNING SERVER
server.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
deleteUnusedAccountsEveryWeek();
