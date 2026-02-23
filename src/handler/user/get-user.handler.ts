import { UserRepository } from "../../domain/user.repository";
import { User } from "../../schemas/user.model";
import { Handler } from "../types";

export enum GetUserHandlerError {
    userNotFound,
}

export type GetUserHandlerResponse = {
    user: User;
};

export type GetUserHandlerRequest = {
    userId: number;
};

export type GetUserHandler = Handler<
    GetUserHandlerRequest,
    GetUserHandlerResponse,
    GetUserHandlerError
>;

export function createGetUserHandler(
    userRepository: UserRepository,
): GetUserHandler {
    return async function ({ userId }) {
        const user = await userRepository.findUserById(userId);
        if (!user) {
            return { error: GetUserHandlerError.userNotFound };
        }
        return {
            user: User.fromDomain(user),
        };
    };
}
