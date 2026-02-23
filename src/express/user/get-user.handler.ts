import { Request, Response } from "express";
import { GetUserHandler, GetUserHandlerError } from "../../handler";
import { UserParams } from "../../schemas";
import { MESSAGE_USER_NOT_FOUND } from "../messages";

export function createGetUserExpressHandler(h: GetUserHandler) {
    return async function (req: Request, res: Response) {
        const { userId } = req.typedParams as UserParams;
        const result = await h({ userId });
        if ("error" in result) {
            switch (result.error) {
                case GetUserHandlerError.userNotFound:
                    return res
                        .status(404)
                        .json({ message: MESSAGE_USER_NOT_FOUND });
            }
        }
        return res.json(result.user);
    };
}
