import { Request } from "express";

export type MatchWithObject = {
  ContentType: string;
  Body: String[];
};

/**
 * Function matches real request with expected request
 * @param request ExpressJS API Request Object
 * @param matchWith Takes MatchWithObject to match request data
 * @returns boolean
 */
export default function matchRequest(
  request: Request,
  matchWith: MatchWithObject
): boolean {
  if (request.header("Content-Type") !== matchWith.ContentType) return false;

  const availableParams: String[] = Object.keys(request.body);

  let reponseFromLoop = true;
  matchWith.Body.forEach((param: String) => {
    if (availableParams.indexOf(param) === -1) {
      reponseFromLoop = false;
    }
  });
  return reponseFromLoop;
}
