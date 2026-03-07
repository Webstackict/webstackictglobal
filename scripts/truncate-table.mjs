import './load-env.mjs';
import { prisma } from '../lib/prisma.js';

async function run() {
    console.log('Deleting all rows in scholarship_applications...');
    try {
        await prisma.scholarship_applications.deleteMany();
        console.log('✅ Table cleaned successfully.');
    } catch (error) {
        console.error('❌ Failed to clean table:', error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
