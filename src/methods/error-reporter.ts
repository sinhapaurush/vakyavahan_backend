import { Response } from "express";
export function reportRequestError(res: Response): void {
  res.status(400);
  res.json({ status: 400, message: "Invalid Request" });
}
