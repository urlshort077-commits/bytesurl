import { Plan, PrismaClient, Role, UserStatus } from "../../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { envVars } from "../config/envVars"


const adapter = new PrismaPg({ connectionString: envVars.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    const admin = await prisma.user.upsert({
        where: { email: envVars.ADMIN_EMAIL },
        update: {},
        create: {
            firebaseUid: envVars.ADMIN_FIREBASE_UID,
            email: envVars.ADMIN_EMAIL,
            name: 'Admin',
            role: Role.ADMIN,
            status: UserStatus.ACTIVE,
        }
    })

    await prisma.subscriptions.upsert({
        where: { userId: admin.id },
        update: {},
        create: {
            userId: admin.id,
            plan: Plan.ULTIMATE,
            urlLimit: 999999,
        }
    })

    console.log('Admin seeded:', admin.email)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())