
import path from 'node:path'
import fs from 'node:fs'
import { logger } from '../lib/logger'
import { query } from './db'

const migrateDir = path.resolve(process.cwd(), 'src', 'migrations')
console.log('Migrate Dir:', migrateDir)

async function runMigrations(){
    logger.info('Looking for migrations in:', migrateDir)

    const files = fs.readdirSync(migrateDir).filter(file => file.endsWith('.sql')).sort()

    if(files.length === 0){
        logger.info('No migration files found.')
        return
    }

    for(const file of files){
        const fullPath = path.join(migrateDir, file)
        const sql = fs.readFileSync(fullPath, 'utf8')

        logger.info(`Running migration: ${file}`)

        await query(sql)

        logger.info(`Finished migration ${file}.`)
    }
}

runMigrations().then(()=>{
    logger.info('All migrations completed successfully.')
    process.exit(0)
}).catch(err => {
    logger.error('Migration failed:', (err as Error).message)
    process.exit(1)
})