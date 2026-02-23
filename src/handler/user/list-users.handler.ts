import { UserRepository } from "../../domain";
import { User } from "../../schemas";
import { Handler } from "../types";

export type ListUsersHandlerResponse = {
    users: User[];
};

export type ListUsersHandler = Handler<never, ListUsersHandlerResponse, never>;

export function createListUsersHandler(
    userRepository: UserRepository,
): ListUsersHandler {
    return async function () {
        const users = await userRepository.listUsers();
        return {
            users: users.map(User.fromDomain),
        };
    };
}
