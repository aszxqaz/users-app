import { Expose, Transform } from "class-transformer";
import {
    CustomIsNotEmpty,
    CustomIsString,
    CustomMaxLength,
    CustomMinLength,
    FULLNAME_MAX_LENGTH,
    FULLNAME_MIN_LENGTH,
    IsDDMMYYY,
    IsFullName,
} from "../decorators";
import { parseDDMMYYYY } from "../utils";
import { LoginRequestBody } from "./login.dto";

export class RegisterRequestBody extends LoginRequestBody {
    @Expose({ name: "full_name" })
    @CustomMaxLength(FULLNAME_MAX_LENGTH)
    @CustomMinLength(FULLNAME_MIN_LENGTH)
    @IsFullName()
    @CustomIsString()
    @CustomIsNotEmpty()
    fullName: string;

    @Expose({ name: "birth_date" })
    @Transform(parseDDMMYYYY)
    @IsDDMMYYY()
    birthDate: Date;
}
