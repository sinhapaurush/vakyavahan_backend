import { Request, Response, Router } from "express";
import createNewUser from "./methods/new-user";

const router: Router = Router();

router.post("/new-client", async (req: Request, res: Response) => {
  let { name, organization, deviceId, password } = req.query;
  if (name && organization && deviceId && password) {
    try {
      deviceId = deviceId.toString().toLowerCase();
      name = name.toString();
      organization = organization.toString();
      password = password.toString();
      if (name.length > 3 && deviceId && password.length > 8) {
        const dbStatus = await createNewUser({
          name,
          organization,
          deviceId,
          password,
        });
        if (dbStatus) {
          res.statusCode = 200;
          res.json({ status: 200, message: "Success" });
        } else {
          res.statusCode = 400;
          res.json({ status: 400, message: "Invalid Request" });
        }
      } else {
        res.statusCode = 403;
        res.json({ status: 403, message: "Denied due to tweaked data" });
      }
    } catch {
      res.statusCode = 400;
      res.json({ status: 400, message: "Bad Request" });
    }
    return;
  }
  res.statusCode = 400;
  res.json({ status: 400, message: "Bad Request" });
});

export { router };
