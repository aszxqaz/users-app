import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../domain";
import { GetUserFromTokenHandler } from "../handler";

declare module "express" {
    export interface Request {
        user?: User;
    }
}

const MESSAGE_SAME_USER_OR_ADMIN =
    "Пользователь не является админом или не располагает данным ресурсом";
const MESSAGE_ADMIN = "Пользователь не является админом";
const MESSAGE_AUTHORIZED =
    "Текущий пользователь авторизован, необходимо выйти из сессии";
const MESSAGE_UNAUTHORIZED = "Пользователь не авторизован";
const MESSAGE_BLOCKED = "Пользователь заблокирован";

export function createAuthMiddleware(h: GetUserFromTokenHandler) {
    return async function (req: Request, _: Response, next: NextFunction) {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.match(/^Bearer (.+)$/)?.[1];

        if (token) {
            const result = await h({ token });
            if ("user" in result) {
                req.user = result.user;
            }
        }

        next();
    };
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: MESSAGE_UNAUTHORIZED });
    }

    next();
}

export function reverseAuthGuard(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (req.user) {
        return res
            .status(StatusCodes.CONFLICT)
            .json({ message: MESSAGE_AUTHORIZED });
    }

    next();
}

export function sameUserOrAdminGuard(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const userId = req.params["userId"];
    if (typeof userId == "string" && +userId === req.user?.id) return next();
    if (req.user?.role == "admin") return next();
    return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: MESSAGE_SAME_USER_OR_ADMIN });
}

export function adminGuard(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role == "admin") return next();
    return res.status(StatusCodes.FORBIDDEN).json({ message: MESSAGE_ADMIN });
}

export function blockedGuard(req: Request, res: Response, next: NextFunction) {
    if (!req.user?.active) {
        return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: MESSAGE_BLOCKED });
    }
    next();
}
