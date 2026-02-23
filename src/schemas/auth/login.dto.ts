import {
    CustomIsEmail,
    CustomIsNotEmpty,
    CustomIsString,
    CustomMaxLength,
    CustomMinLength,
    EMAIL_MAX_LENGTH,
    EMAIL_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
} from "../decorators";

export class LoginRequestBody {
    @CustomMaxLength(EMAIL_MAX_LENGTH)
    @CustomMinLength(EMAIL_MIN_LENGTH)
    @CustomIsEmail()
    @CustomIsString()
    @CustomIsNotEmpty()
    email: string;

    @CustomMaxLength(PASSWORD_MAX_LENGTH)
    @CustomMinLength(PASSWORD_MIN_LENGTH)
    @CustomIsString()
    @CustomIsNotEmpty()
    password: string;
}
