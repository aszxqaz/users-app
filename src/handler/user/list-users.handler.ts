import { UserRepository } from "../../domain/user.repository";
import { User } from "../../schemas/user.model";
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
