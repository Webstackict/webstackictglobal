import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    const students = await prisma.studentLedger.findMany({ orderBy: { registration_date: 'desc' } })
    console.log("SUCCESS! Found", students.length)
  } catch(e) {
    console.error("PRISMA ERROR:", e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
