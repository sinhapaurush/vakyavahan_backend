import { Request } from "express";

type LooseObject = {
    [key: string]: any
};
export type RequestMetaData = {
    contentType: string,
    parameters: string[],
};



export type RequestExamination = {
    result: boolean,
    params: LooseObject,
};

const failedRequest: RequestExamination = {
    result: false,
    params: {},
};

export function checkRequest(req: Request, metaData: RequestMetaData): RequestExamination {
    if (!req.header("Content-Type")?.startsWith(metaData.contentType)) {
        return failedRequest;
    }
    const realParameters = Object.keys(req.body);
    let result: boolean = true;
    for (let param of metaData.parameters) {
        if (realParameters.indexOf(param) === -1) {
            result = false;
            break;
        }
    }
    const resultantObject: RequestExamination = {
        result: result,
        params: result ? req.body : {},
    };
    return resultantObject;
}