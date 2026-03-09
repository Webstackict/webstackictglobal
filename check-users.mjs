
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.$queryRaw`
    SELECT id, email, created_at, email_confirmed_at 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 5;
  `;
    console.log('Recent Users:', JSON.stringify(users, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
