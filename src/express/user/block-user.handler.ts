import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
    BlockUserHandler,
    BlockUserHandlerError,
} from "../../handler/user/block-user.handler";
import { UserParams } from "../../schemas/user.params";
import { MESSAGE_USER_NOT_FOUND } from "../messages";

export function createBlockUserExpressHandler(
    blockUserHandler: BlockUserHandler,
) {
    return async function (req: Request, res: Response) {
        const { userId } = req.typedParams as UserParams;
        const result = await blockUserHandler({ userId });
        if ("error" in result) {
            switch (result.error) {
                case BlockUserHandlerError.userNotFound:
                    return res
                        .status(404)
                        .json({ message: MESSAGE_USER_NOT_FOUND });
            }
        }
        return res.sendStatus(StatusCodes.NO_CONTENT);
    };
}
