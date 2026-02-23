import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { type NextFunction, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import toSnakeCase from "to-snake-case";

declare global {
    namespace Express {
        export interface Request {
            typedBody: unknown;
            typedParams: unknown;
        }
    }
}

export function pathParamsMiddleware<T>(dtoClass: new () => T) {
    return createMiddleware(
        dtoClass,
        (req) => req.params,
        (req, val) => (req.typedParams = val),
    );
}

export function requestBodyMiddleware<T>(dtoClass: new () => T) {
    return createMiddleware(
        dtoClass,
        (req) => req.body,
        (req, val) => (req.typedBody = val),
    );
}

function createMiddleware<T, K>(
    dtoClass: new () => T,
    extractor: (req: Request) => K,
    populator: (req: Request, value: T) => void,
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const plain = extractor(req);
        if (!plain) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Передан пустой запрос",
            });
        }

        const instance = plainToInstance(dtoClass, extractor(req));
        const validationErrors: ValidationError[] = await validate(
            (instance as unknown as object) ?? {},
            {
                stopAtFirstError: true,
                whitelist: true,
                forbidNonWhitelisted: true,
            },
        );

        if (validationErrors.length > 0) {
            const errors = validationErrors
                .map((error) =>
                    error.constraints
                        ? {
                              field: toSnakeCase(error.property),
                              message: Object.values(error.constraints)[0],
                          }
                        : {},
                )
                .filter((x) => Object.keys(x).length);

            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                message: "Ошибка валидации",
                errors,
            });
        }
        populator(req, instance);
        next();
    };
}
