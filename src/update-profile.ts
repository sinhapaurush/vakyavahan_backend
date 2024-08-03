import { Router, Request, Response } from 'express';
import { checkRequest, RequestExamination, RequestMetaData } from './methods/check-request';
import updateClient from './methods/update-client';

const router: Router = Router();


const VALID_REQUEST: RequestMetaData = {
    contentType: "application/json",
    parameters: ["name", "org", "auth", "client"]
};

router.post("/update-profile", async (req: Request, res: Response) => {
    const requestResult: RequestExamination = checkRequest(req, VALID_REQUEST);
    if (requestResult.result) {
        const { name, org, auth, client } = requestResult.params;
        const updatedClient = await updateClient(name, org, auth, client);
        if (updatedClient) {
            res.statusCode = 200;
            res.json({ status: 200, message: "Ok" });
            return;
        }
        res.statusCode = 403;
        res.json({ status: 403, message: "Denied" });
        return;
    }
    res.statusCode = 404;
    res.json({ status: 404, message: "Not Found" });
});


export { router };