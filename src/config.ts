import { configDotenv } from "dotenv";

configDotenv();

export const config = {
    databaseUrl: mustGetEnv("DATABASE_URL"),
    jwtSecret: mustGetEnv("JWT_SECRET"),
    serverPort: mustGetEnv("PORT"),
};

function mustGetEnv(name: string) {
    if (typeof process.env[name] != "string" || process.env[name].length == 0) {
        throw new Error(`Env var ${name} not set`);
    }
    return process.env[name];
}
