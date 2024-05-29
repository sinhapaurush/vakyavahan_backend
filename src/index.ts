import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http, { Server as HTTPServer } from "http";
import { router as sendSMSRouter } from "./send-sms";
import socketHandler from "./methods/socket";

// CONFIGURING .env
dotenv.config();
const PORT = process.env.PORT || 3000;

// INITIALIZING EXPRESS
const app: Express = express();
const server: HTTPServer = http.createServer(app);

// INVOKING SOCKET HANDLER FROM EXTERNAL FILE
socketHandler(server);

// CONFIGURING EXTERNAL ROUTES
app.use(sendSMSRouter);

// ROOT ROUTE
app.get("/", (req: Request, res: Response) => {
  res.json(req.query);
});

// RUNNING SERVER
server.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
