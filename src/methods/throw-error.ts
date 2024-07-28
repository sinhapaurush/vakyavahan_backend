import { Response } from "express";
/**
 * A function to throw express error, yk DNRYS
 */
export default function sendResponse(
  res: Response,
  code: number,
  message: string
): undefined {
  res.status(code);
  res.json({ status: code, message: message });
  return undefined;
}
