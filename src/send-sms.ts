import { Request, Response, Router } from "express";
import { SendApiRequestData } from "./types/request";
import { wsObject } from ".";
import {
  checkRequest,
  RequestExamination,
  RequestMetaData,
} from "./methods/check-request";
import { RequestContentType } from "./types/request-type";
import sendResponse from "./methods/throw-error";

const router: Router = Router();

const acceptedRequest: RequestMetaData = {
  contentType: RequestContentType.form,
  parameters: ["authtoken", "message", "target"],
};
router.post("/send-sms", async (req: Request, res: Response) => {
  const matchedRequest: RequestExamination = checkRequest(req, acceptedRequest);
  if (matchedRequest) {
    const { authtoken, message, target }: SendApiRequestData = matchedRequest.params;
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
  } else {
    sendResponse(res, 404, "API not found");
  }
});

export { router };
