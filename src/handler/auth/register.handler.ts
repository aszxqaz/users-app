import { User, UserRepository } from "../../domain";
import { PasswordService } from "../../service";
import { Handler } from "../types";

export enum RegisterHandlerError {
    emailOccupied,
}

export type RegisterHandlerResponse = {
    user: User;
};

export type RegisterHandlerRequest = {
    email: string;
    fullName: string;
    password: string;
    birthDate: Date;
};

export type RegisterHandler = Handler<
    RegisterHandlerRequest,
    RegisterHandlerResponse,
    RegisterHandlerError
>;

export function createRegisterHandler(
    passwordService: PasswordService,
    userRepository: UserRepository,
): RegisterHandler {
    return async ({ email, fullName, password, birthDate }) => {
        const passwordHash = await passwordService.hash(password);

        const existing = await userRepository.findUserByEmail(email);
        if (existing) {
            return {
                error: RegisterHandlerError.emailOccupied,
            };
        }

        const user = await userRepository.createUser({
            email,
            fullName,
            passwordHash,
            birthDate,
        });

        return {
            user,
        };
    };
}
