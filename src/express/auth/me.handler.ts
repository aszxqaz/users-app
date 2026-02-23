import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../../schemas/user.model";

export const meExpressHandler = () => async (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json(User.fromDomain(req.user!));
};
