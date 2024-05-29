import { Request, Response, Router } from "express";
import { SendApiRequestData } from "./types/request";
import { wsObject } from ".";

const router: Router = Router();

router.get("/send-sms", async (req: Request, res: Response) => {
  const { authtoken, message, target }: SendApiRequestData = req.query;
  if (!(authtoken && message && target)) {
    res.statusCode = 400;
    res.json({
      status: 400,
      message: "Forbidden: Invalid Request",
    });
    return;
  }
  //   CORRECT REQUEST CODE CHECK
  const sentMessage = await wsObject.sendSMSviaSocket(
    authtoken!,
    target!,
    message!
  );
  if (!sentMessage) {
    res.statusCode = 410;
    res.json({ status: 410, message: "No client is available" });
    return;
  }
  res.statusCode = 200;
  res.json({ status: 200, message: "Ok" });
});

export { router };
