import { compare, hash } from "bcrypt";

export interface PasswordService {
    hash(plain: string): Promise<string>;
    verify(plain: string, hashed: string): Promise<boolean>;
}

export class BcryptPasswordService implements PasswordService {
    constructor(private readonly config: { rounds: number } = { rounds: 10 }) {}

    async hash(plain: string): Promise<string> {
        const hashpwd = await hash(plain, this.config.rounds);
        return hashpwd;
    }

    async verify(plain: string, hashed: string): Promise<boolean> {
        const ok = await compare(plain, hashed);
        return ok;
    }
}
