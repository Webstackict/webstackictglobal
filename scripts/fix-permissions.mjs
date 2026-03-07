import './load-env.mjs';
import { prisma } from '../lib/prisma.js';

async function run() {
    console.log('Granting permissions on public schema...');
    try {
        await prisma.$executeRawUnsafe('GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;');
        await prisma.$executeRawUnsafe('GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;');
        await prisma.$executeRawUnsafe('GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;');
        await prisma.$executeRawUnsafe('GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;');
        console.log('✅ Permissions granted.');
    } catch (error) {
        console.error('❌ Failed to grant permissions:', error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
