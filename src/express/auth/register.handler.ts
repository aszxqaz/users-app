import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RegisterHandler, RegisterHandlerError } from "../../handler";
import { RegisterRequestBody, User } from "../../schemas";

const MESSAGE_EMAIL_OCCUPIED = "Почтовый адрес уже занят";

export const createRegisterExpressHandler =
    (handle: RegisterHandler) => async (req: Request, res: Response) => {
        const { email, fullName, password, birthDate } =
            req.typedBody as RegisterRequestBody;

        const result = await handle({ email, fullName, password, birthDate });

        if ("error" in result) {
            switch (result.error) {
                case RegisterHandlerError.emailOccupied:
                    return res
                        .status(StatusCodes.CONFLICT)
                        .json({ message: MESSAGE_EMAIL_OCCUPIED });
            }
        }

        return res
            .status(StatusCodes.CREATED)
            .json(User.fromDomain(result.user));
    };
