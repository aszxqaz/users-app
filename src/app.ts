import express from "express";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "./domain/user.repository";
import { createGetUserFromTokenHandler } from "./handler/auth/get-user-from-token.handler";
import { createAuthMiddleware, errorHandler } from "./middleware";
import { createAuthRouter, createUsersRouter } from "./routes";
import { PasswordService, TokenSerivce } from "./service";

export function createApp(
    tokenService: TokenSerivce<string>,
    userRepository: UserRepository,
    passwordService: PasswordService,
) {
    const app = express();

    app.use(express.urlencoded());

    app.use(express.json());

    app.use(errorHandler);

    app.use(
        createAuthMiddleware(
            createGetUserFromTokenHandler(tokenService, userRepository),
        ),
    );

    app.use(
        "/auth",
        createAuthRouter(passwordService, userRepository, tokenService),
    );

    app.use("/users", createUsersRouter(userRepository));

    app.get("/healthcheck", (_, res) =>
        res.status(StatusCodes.OK).json({ ok: true }),
    );

    return app;
}
