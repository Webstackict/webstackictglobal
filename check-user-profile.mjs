
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.users.findFirst({
        where: { email: 'webstackict@gmail.com' },
        include: {
            user_profile: true
        }
    });
    console.log('User Profile:', JSON.stringify(user, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
