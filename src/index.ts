import { PrismaPg } from "@prisma/adapter-pg";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { PrismaClient } from "../generated/prisma/client";
import { createApp } from "./app";
import { config } from "./config";
import { PrismaUserRepository } from "./domain/user.repository";
import { seed } from "./seeder";
import { BcryptPasswordService, JwtTokenService } from "./service";

async function main() {
    console.log(config);
    const userRepository = new PrismaUserRepository(
        new PrismaClient({
            adapter: new PrismaPg({ connectionString: config.databaseUrl }),
        }),
    );

    const passwordService = new BcryptPasswordService();

    const tokenService = new JwtTokenService<string>({
        secret: config.jwtSecret,
    });

    await seed(userRepository, passwordService);

    const app = createApp(tokenService, userRepository, passwordService);

    const swaggerDocument = YAML.load(
        path.join(__dirname, "../api/openapi.yml"),
    );
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.listen(+config.serverPort, (err) => {
        if (err) {
            console.error(`Failed to serve: ${err}`);
        } else {
            console.log(`App listening on :${config.serverPort}`);
        }
    });
}

main();
