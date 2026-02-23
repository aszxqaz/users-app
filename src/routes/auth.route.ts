import express from "express";
import { UserRepository } from "../domain/user.repository";
import { createLoginExpressHandler } from "../express/auth/login.handler";
import { meExpressHandler } from "../express/auth/me.handler";
import { createRegisterExpressHandler } from "../express/auth/register.handler";
import { createGetUserFromTokenHandler } from "../handler/auth/get-user-from-token.handler";
import { createLoginHandler } from "../handler/auth/login.handler";
import { createRegisterHandler } from "../handler/auth/register.handler";
import {
    authGuard,
    createAuthMiddleware,
    reverseAuthGuard,
} from "../middleware/auth.middleware";
import { requestBodyMiddleware } from "../middleware/validation.middleware";
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
