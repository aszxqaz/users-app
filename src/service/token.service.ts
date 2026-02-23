import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export enum TokenServiceSignError {}

export enum TokenServiceVerifyError {
    tokenExpired,
    tokenMalformed,
}

export interface TokenSerivce<T> {
    sign(
        payload: T,
    ): Promise<{ token: string } | { error: TokenServiceSignError }>;
    verify(
        token: string,
    ): Promise<{ object: T } | { error: TokenServiceVerifyError }>;
}

type JwtTokenServiceConfig = {
    secret: string;
};

export class JwtTokenService<
    T extends string | object,
> implements TokenSerivce<T> {
    constructor(private readonly config: JwtTokenServiceConfig) {}

    async sign(
        payload: T,
    ): Promise<{ token: string } | { error: TokenServiceSignError }> {
        return {
            token: jwt.sign(payload, this.config.secret),
        };
    }

    async verify(
        token: string,
    ): Promise<{ object: T } | { error: TokenServiceVerifyError }> {
        try {
            const decoded = jwt.verify(token, this.config.secret) as T;
            return {
                object: decoded,
            };
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                return {
                    error: TokenServiceVerifyError.tokenExpired,
                };
            }

            if (e instanceof JsonWebTokenError) {
                return {
                    error: TokenServiceVerifyError.tokenMalformed,
                };
            }

            throw e;
        }
    }
}
