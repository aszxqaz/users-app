import { Request, Response } from "express";

import { ListUsersHandler } from "../../handler/user/list-users.handler";

export function createListUsersExpressHandler(h: ListUsersHandler) {
    return async function (_: Request, res: Response) {
        const { users } = await h();
        return res.json(users);
    };
}
