import { UserRepository } from "../../domain/user.repository";
import { User } from "../../schemas/user.model";
import { PasswordService } from "../../service/password.service";
import { TokenSerivce } from "../../service/token.service";
import { Handler } from "../types";

export enum LoginHandlerError {
    emailNotFound,
    passwordNotVerified,
    userBlocked,
    internalError,
}

export type LoginHandlerResponse = {
    user: User;
    token: string;
};

export type LoginHandlerRequest = {
    email: string;
    password: string;
};

export type LoginHandler = Handler<
    LoginHandlerRequest,
    LoginHandlerResponse,
    LoginHandlerError
>;

export function createLoginHandler(
    userRepository: UserRepository,
    passwordService: PasswordService,
    tokenSerivce: TokenSerivce<string>,
): LoginHandler {
    return async (args: { email: string; password: string }) => {
        const { email, password } = args;
        const user = await userRepository.findUserByEmail(email);
        if (!user)
            return {
                error: LoginHandlerError.emailNotFound,
            };

        if (!(await passwordService.verify(password, user.passwordHash)))
            return {
                error: LoginHandlerError.passwordNotVerified,
            };

        if (!user.active) {
            return {
                error: LoginHandlerError.userBlocked,
            };
        }

        const result = await tokenSerivce.sign(user.id.toString());

        if ("error" in result) {
            return {
                error: LoginHandlerError.internalError,
            };
        }

        return {
            user: User.fromDomain(user),
            token: result.token,
        };
    };
}
