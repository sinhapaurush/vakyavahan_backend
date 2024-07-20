import { Request, Response, Router } from "express";
import { checkRequest, RequestExamination, RequestMetaData } from "./methods/check-request";
import { RequestContentType } from "./types/request-type";
import { createNewUser, NewUserProcessResponse } from "./methods/new-user";
import { Collection, Db, MongoClient } from "mongodb";

const router = Router();

const acceptedRequest: RequestMetaData = {
  contentType: RequestContentType.json,
  parameters: [
    "name",
    "org",
    "deviceid"
  ]
};
router.post("/new-user", async (req: Request, res: Response) => {
  const requestExaminationResult: RequestExamination = checkRequest(req, acceptedRequest);
  if (requestExaminationResult.result) {
    const { name, org, deviceid } = requestExaminationResult.params;

    if (name.length > 2 && org.length > 3 && deviceid.length > 8) {

      const dbResponse: NewUserProcessResponse = await createNewUser(name, org, deviceid);
      if (dbResponse.success) {
        res.status(200);
        res.json({ status: 200, message: "Ok", authtoken: dbResponse.client?.authid, clienttoken: dbResponse.client?.clienttoken });
      } else {
        res.status(503);
        res.json({ status: 503, message: "Service Unavailable" });
      }

    } else {
      res.status(403);
      res.json({ status: 403, message: "Denied" });
    }

    res.status(200);
    res.json(requestExaminationResult.params);
  } else {
    res.status(400);
    res.json({ status: 400, message: "Invalid Request" });
  }
});

export { router };