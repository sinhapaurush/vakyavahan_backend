import { Router, Request, Response } from "express";
import {
  checkRequest,
  RequestExamination,
  RequestMetaData,
} from "./methods/check-request";
import sendResponse from "./methods/throw-error";
import DBHandler, { CollectionName } from "./methods/mongo";

const router = Router();

async function fetchRecordByDeviceId(
  deviceId: string,
  res: Response
): Promise<void> {
  const db = new DBHandler();
  const result = await db.select(CollectionName.client, { deviceId: deviceId });
  db.close();
  if (result) {
    res.status(200);
    res.json({
      status: 200,
      message: "Ok",
      authtoken: result.authid,
      clienttoken: result.clienttoken,
    });
  } else {
    sendResponse(res, 404, "Not found");
  }
}

const acceptedRequest: RequestMetaData = {
  contentType: "application/json",
  parameters: ["deviceid"],
};
router.post("/check-exists", (req: Request, res: Response) => {
  const matchRequest: RequestExamination = checkRequest(req, acceptedRequest);
  if (matchRequest) {
    const { deviceid }: { deviceid: string } = req.body;
    fetchRecordByDeviceId(deviceid, res);
    return;
  } else {
    return sendResponse(res, 404, "Not found");
  }
});

export { router };
