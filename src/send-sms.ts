import { Request, Response, Router } from "express";
import { SendApiRequestData } from "./types/request";
import fetchSocketId from "./methods/fetch-socket";

const router: Router = Router();

router.get("/send-sms", (req: Request, res: Response) => {
  const { authtoken, message, target }: SendApiRequestData = req.query;
  if (!(authtoken && message && target)) {
    res.statusCode = 400;
    res.json({
      status: 400,
      message: "Forbidden: Invalid Request",
    });
  }
  //   CORRECT REQUEST CODE CHECK
  const socketID = fetchSocketId("!23");
  if (!socketID) {
    res.statusCode = 410;
    res.json({
      status: 410,
      message: "Client not connected to the server",
    });
  }
});

export { router };
