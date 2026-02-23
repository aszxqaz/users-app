import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LoginHandler, LoginHandlerError } from "../../handler";
import { LoginRequestBody } from "../../schemas";

const MESSAGE_AUTH_FAILED = "Неверный почтовый адрес или пароль";
const MESSAGE_LOGIN_BLOCKED = "Вход запрещен - пользователь заблокирован";
const MESSAGE_INTERNAL_ERROR = "Что-пошло не так, повторите попытку позднее";

export const createLoginExpressHandler =
    (h: LoginHandler) => async (req: Request, res: Response) => {
        const { email, password } = req.body as LoginRequestBody;

        const result = await h({ email, password });

        if ("error" in result) {
            switch (result.error) {
                case LoginHandlerError.emailNotFound:
                case LoginHandlerError.passwordNotVerified:
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        message: MESSAGE_AUTH_FAILED,
                    });
                case LoginHandlerError.userBlocked:
                    return res.status(StatusCodes.FORBIDDEN).json({
                        message: MESSAGE_LOGIN_BLOCKED,
                    });
                case LoginHandlerError.internalError:
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: MESSAGE_INTERNAL_ERROR,
                    });
            }
        }

        return res.status(StatusCodes.CREATED).json({
            user: result.user,
            token: result.token,
        });
    };
