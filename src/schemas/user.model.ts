import { Expose, plainToInstance, Transform } from "class-transformer";
import { User as DomainUser } from "../domain";
import { formatToDDMMYYYY } from "./utils";

export class User {
    @Expose()
    id: number;

    @Expose({ name: "fullName" })
    full_name: string;

    @Transform(formatToDDMMYYYY)
    @Expose({ name: "birthDate" })
    birth_date: string;

    @Expose()
    email: string;

    @Expose()
    role: string;

    @Expose()
    active: boolean;

    static fromDomain(user: DomainUser): User {
        return plainToInstance(User, user, {
            excludeExtraneousValues: true,
        });
    }
}
