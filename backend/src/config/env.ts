import 'dotenv/config';
import {z} from 'zod';

const EnvSchema = z.object({
    PORT : z.string().default('5000'),

    DB_HOST : z.string().default('localhost'),
    DB_PORT : z.string().default('5432'),
    DB_NAME : z.string().default('database'),
    DB_USER : z.string().default('user'),
    DB_PASSWORD : z.string().default('password'),
})

const parsed = EnvSchema.safeParse(process.env);

if(!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;