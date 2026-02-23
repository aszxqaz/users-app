import { PrismaClient } from "../../generated/prisma/client";
import { User } from "./user.model";

export type UpdateUserArgs = Partial<
    Pick<User, "active" | "birthDate" | "fullName">
>;

export type CreateUserArgs = Pick<
    User,
    "birthDate" | "fullName" | "email" | "passwordHash"
> &
    Partial<Pick<User, "role">>;

export interface UserRepository {
    createUser(args: CreateUserArgs): Promise<User>;
    findUserById(id: number): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    listUsers(): Promise<User[]>;
    updateUser(userId: number, args: UpdateUserArgs): Promise<User | null>;
}

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findUserByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user;
    }

    async findUserById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user;
    }

    async listUsers(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users;
    }

    async createUser(args: CreateUserArgs): Promise<User> {
        const { email, fullName, passwordHash, birthDate, role } = args;
        const user = await this.prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash,
                birthDate,
                role,
            },
        });
        return user;
    }

    async updateUser(
        userId: number,
        args: UpdateUserArgs,
    ): Promise<User | null> {
        const { active, birthDate, fullName } = args;
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { active, birthDate, fullName },
        });
        return user;
    }
}
