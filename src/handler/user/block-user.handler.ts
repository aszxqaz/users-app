import { UserRepository } from "../../domain/user.repository";
import { Handler } from "../types";

export enum BlockUserHandlerError {
    userNotFound,
}

export type BlockUserHandlerRequest = {
    userId: number;
};

export type BlockUserHandler = Handler<
    BlockUserHandlerRequest,
    {},
    BlockUserHandlerError
>;

export function createBlockUserHandler(
    userRepository: UserRepository,
): BlockUserHandler {
    return async function ({ userId }) {
        const user = await userRepository.updateUser(userId, { active: false });
        if (!user) {
            return { error: BlockUserHandlerError.userNotFound };
        }
        return {};
    };
}
