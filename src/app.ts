import express, { Application, json, Request, Response, urlencoded } from 'express'
import { IndexRoutes } from './app/routes';
import { urlController } from './app/modules/urls/urls.controller';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';

const app: Application = express()

app.set('trust proxy', true)
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }))
app.use(json())
app.use(urlencoded({ extended: true }))

app.use('/api/v1', IndexRoutes)

app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'API is working',
    })
})

app.get('/:shortId', urlController.redirectUrl)

app.use(globalErrorHandler)
app.use(notFound)

export default app