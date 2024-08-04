import { Router, Request, Response } from 'express';
import { checkRequest, RequestExamination, RequestMetaData } from './methods/check-request';
import { Collection, MongoClient } from 'mongodb';
import { CollectionName, DB_NAME, DB_URI } from './methods/mongo';

const router: Router = Router();


const acceptedRquest: RequestMetaData = {
    contentType: "application/json",
    parameters: [
        "deviceid"
    ]
};

router.post("auto-login", async (req: Request, res: Response) => {
    const requestMatch: RequestExamination = checkRequest(req, acceptedRquest);

    if (requestMatch.result) {
        try {
            const reqDevId: string = requestMatch.params.deviceid;
            const connection: MongoClient = new MongoClient(DB_URI);
            const collection: Collection = connection.db(DB_NAME).collection(CollectionName.client);
            const result = await collection.findOne({ deviceId: reqDevId });
            if (result) {
                res.statusCode = 200;
                res.json({ status: 200, auth: result.authid, client: result.clienttoken, name: result.name, org: result.organization });
                return;
            }
            res.statusCode = 404;
            res.json({ status: 404, message: "Not found" });
        } catch (e) {
            res.statusCode = 404;
            res.json({ status: 404, message: "Not found" });
        }
        return;
    } else {
        res.statusCode = 404;
        res.json({ status: 400, message: "Not found" });
    }
});


export { router };