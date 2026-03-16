import app from "./app"
import 'dotenv/config'
import { envVars } from "./config/envVars"

const bootstrap = () => {
    try {
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on ${envVars.PORT}`)
        })
    } catch (err) {
        console.error('Failed to start the server', err)
    }
}

bootstrap()