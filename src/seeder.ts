import { UserRepository } from "./domain/user.repository";
import { PasswordService } from "./service/password.service";

export async function seed(
    userRepository: UserRepository,
    passwordService: PasswordService,
) {
    const passwordHash = await passwordService.hash("password");

    try {
        await userRepository.createUser({
            birthDate: new Date(2000, 12, 12, 12),
            email: "admin@usersapp.ru",
            passwordHash,
            fullName: "Админов Админ Админович",
            role: "admin",
        });
        await userRepository.createUser({
            birthDate: new Date(2000, 12, 12, 12),
            email: "user@usersapp.ru",
            passwordHash,
            fullName: "Юзеров Юзер Юзерович",
        });
    } catch (_) {}
}
