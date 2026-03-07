import './load-env.mjs';
import { prisma } from '../lib/prisma.js';

async function run() {
    console.log('Listing all schemas and tables...');
    try {
        const schemas = await prisma.$queryRawUnsafe("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'pg_catalog');");
        console.log('Schemas found:', schemas);

        for (const s of schemas) {
            const tables = await prisma.$queryRawUnsafe(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${s.schema_name}';`);
            console.log(`Tables in ${s.schema_name}:`, tables);
        }
    } catch (error) {
        console.error('❌ Failed to list schemas/tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
