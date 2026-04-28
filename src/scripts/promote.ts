import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Please provide an email')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'MANAGER' as any },
    })
    console.log(`Successfully promoted ${user.email} to MANAGER.`)
  } catch (error) {
    console.error(`Error: Could not find user with email ${email}`, error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
