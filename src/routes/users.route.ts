import express from "express";
import { UserRepository } from "../domain/user.repository";
import {
    createBlockUserExpressHandler,
    createGetUserExpressHandler,
    createListUsersExpressHandler,
} from "../express/user";
import {
    createBlockUserHandler,
    createGetUserHandler,
    createListUsersHandler,
} from "../handler/user";
import {
    adminGuard,
    authGuard,
    blockedGuard,
    sameUserOrAdminGuard,
} from "../middleware/auth.middleware";
import { pathParamsMiddleware } from "../middleware/validation.middleware";
import { UserParams } from "../schemas/user.params";

export function createUsersRouter(userRepository: UserRepository) {
    const usersRouter = express.Router();

    usersRouter.use(authGuard, blockedGuard);

    usersRouter.get(
        "/",
        adminGuard,
        createListUsersExpressHandler(createListUsersHandler(userRepository)),
    );

    usersRouter.post(
        "/:userId/block",
        pathParamsMiddleware(UserParams),
        sameUserOrAdminGuard,
        createBlockUserExpressHandler(createBlockUserHandler(userRepository)),
    );

    usersRouter.get(
        "/:userId",
        pathParamsMiddleware(UserParams),
        sameUserOrAdminGuard,
        createGetUserExpressHandler(createGetUserHandler(userRepository)),
    );

    return usersRouter;
}
