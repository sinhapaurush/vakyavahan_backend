/**
 * @author Paurush Sinha
 */
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import dotenv from "dotenv";
import http, { Server as HTTPServer } from "http";
import { router as sendSMSRouter } from "./send-sms";
import { router as newClientRouter } from "./new-client";
import { router as existenceRouter } from "./check-existence";
import SocketHandler from "./methods/socket";
import { deleteUnusedAccountsEveryWeek } from "./methods/delete-spam";
import { RequestContentType } from "./types/request-type";

// CONFIGURING .env
dotenv.config();
const PORT = process.env.PORT || 5000;

// INITIALIZING EXPRESS
const app: Express = express();
const server: HTTPServer = http.createServer(app);

// INVOKING SOCKET HANDLER FROM EXTERNAL FILE
export const wsObject = new SocketHandler(server);

// PROCESS API DATA TO JSON
app.use((req: Request, res: Response, next: NextFunction) => {
  const contentType = req.header("Content-Type");

  if (contentType === RequestContentType.json) {
    json()(req, res, next);
  } else if (contentType === RequestContentType.form) {
    urlencoded()(req, res, next);
  }
});

// CONFIGURING EXTERNAL ROUTES
app.use(sendSMSRouter);
app.use(newClientRouter);
app.use(existenceRouter);

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
