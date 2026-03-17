import { Subscriptions, User } from "../../generated/prisma/client"

declare global {
    namespace Express {
        interface Request {
            user: User & {
                subscription: Subscriptions | null
            }
        }
    }
}

export {}