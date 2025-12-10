import { env } from "node:process";
import { createApp } from "./app";
import { assertDBConnection } from "./db/db";
import { logger } from "./lib/logger";
import http from "node:http"

async function bootstrap() {
    try{
        await assertDBConnection()

        const app = createApp();

        const server = http.createServer(app);

        const PORT = Number(env.PORT) || 5000;

        server.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
        })

    }catch(err){
        console.error(err);
        logger.error("Error during server bootstrap:", err); ;
        process.exit(1);
    }
}

bootstrap();