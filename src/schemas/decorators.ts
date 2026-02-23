import {
    IsDate,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";

const FIELD_MESSAGE_REQUIRED = "Поле обязательно для заполнения";
const FIELD_MESSAGE_STRING = "Поле должно иметь строчный тип";
const FIELD_MESSAGE_INTEGER = "Поле должно иметь целочисленный тип";

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 24;

export const FULLNAME_MIN_LENGTH = 16;
export const FULLNAME_MAX_LENGTH = 50;

export const EMAIL_MIN_LENGTH = 6;
export const EMAIL_MAX_LENGTH = 30;

export const CustomIsString = () => IsString({ message: FIELD_MESSAGE_STRING });

export const CustomIsInt = () => IsInt({ message: FIELD_MESSAGE_INTEGER });

export const CustomMin = (n: number) =>
    Min(n, { message: `Минимальное значение поля равно $n` });

export const CustomIsNotEmpty = () =>
    IsNotEmpty({ message: FIELD_MESSAGE_REQUIRED });

export const CustomIsEmail = () =>
    IsEmail({}, { message: "Неверный формат почтового адреса" });

export const IsDDMMYYY = () =>
    IsDate({ message: "Неверный формат даты - ожидается ДД.ММ.ГГГГ" });

export const IsFullName = () =>
    Matches(/^\p{Lu}\p{Ll}* \p{Lu}\p{Ll}* \p{Lu}\p{Ll}*$/u, {
        message: "Неверный формат ФИО - ожидается <Имя> <Фамилия> <Отчество>",
    });

export const CustomMinLength = (n: number) =>
    MinLength(n, { message: `Минимальная длина значения поля равна $n` });

export const CustomMaxLength = (n: number) =>
    MaxLength(n, { message: `Максимальная длина значения поля равна $n` });
