import { configDotenv } from "dotenv";

configDotenv();

export const config = {
    databaseUrl: process.env.DATABASE_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    serverPort: process.env.PORT!,
};
