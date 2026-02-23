import { User } from "../../domain/user.model";
import { UserRepository } from "../../domain/user.repository";
import {
    TokenSerivce,
    TokenServiceVerifyError,
} from "../../service/token.service";
import { Handler } from "../types";

export enum GetUserFromTokenHandlerError {
    userNotFound,
    tokenMalformed,
    tokenExpired,
}

export type GetUserFromTokenHandlerResponse = {
    user: User;
};

export type GetUserFromTokenHandlerRequest = {
    token: string;
};

export type GetUserFromTokenHandler = Handler<
    GetUserFromTokenHandlerRequest,
    GetUserFromTokenHandlerResponse,
    GetUserFromTokenHandlerError
>;

export function createGetUserFromTokenHandler(
    tokenService: TokenSerivce<string>,
    userRepository: UserRepository,
): GetUserFromTokenHandler {
    return async ({ token }) => {
        const result = await tokenService.verify(token);
        if ("error" in result) {
            switch (result.error) {
                case TokenServiceVerifyError.tokenExpired:
                    return { error: GetUserFromTokenHandlerError.tokenExpired };
                case TokenServiceVerifyError.tokenMalformed:
                    return {
                        error: GetUserFromTokenHandlerError.tokenMalformed,
                    };
            }
        }
        const userId = result.object;

        if (userId) {
            const user = await userRepository.findUserById(parseInt(userId));
            if (user) {
                return {
                    user,
                };
            }
        }
        return {
            error: GetUserFromTokenHandlerError.userNotFound,
        };
    };
}
