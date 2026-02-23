import express from "express";
import { UserRepository } from "../domain/user.repository";
import {
    createLoginExpressHandler,
    createRegisterExpressHandler,
    meExpressHandler,
} from "../express/auth";
import {
    createGetUserFromTokenHandler,
    createLoginHandler,
    createRegisterHandler,
} from "../handler/auth";
import { requestBodyMiddleware } from "../middleware";
import {
    authGuard,
    createAuthMiddleware,
    reverseAuthGuard,
} from "../middleware/auth.middleware";
import { LoginRequestBody, RegisterRequestBody } from "../schemas/auth";
import { PasswordService, TokenSerivce } from "../service";

export function createAuthRouter(
    passwordService: PasswordService,
    userRepository: UserRepository,
    tokenService: TokenSerivce<string>,
) {
    const authRouter = express.Router();

    authRouter.post(
        "/register",
        reverseAuthGuard,
        requestBodyMiddleware(RegisterRequestBody),
        createRegisterExpressHandler(
            createRegisterHandler(passwordService, userRepository),
        ),
    );

    authRouter.post(
        "/login",
        createAuthMiddleware(
            createGetUserFromTokenHandler(tokenService, userRepository),
        ),
        reverseAuthGuard,
        requestBodyMiddleware(LoginRequestBody),
        createLoginExpressHandler(
            createLoginHandler(userRepository, passwordService, tokenService),
        ),
    );

    authRouter.get("/me", authGuard, meExpressHandler());

    return authRouter;
}
