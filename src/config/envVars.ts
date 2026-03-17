import dotenv from 'dotenv';
import status from 'http-status';
import AppError from '../app/helpers/AppError';

dotenv.config();

interface EnvConfig {
    NODE_ENV:                 string;
    PORT:                     string;
    APP_URL:                  string;
    FRONTEND_URL:             string;
    DATABASE_URL:             string;
    FIREBASE_PROJECT_ID:      string;
    FIREBASE_CLIENT_EMAIL:    string;
    FIREBASE_PRIVATE_KEY:     string;
    FIREBASE_WEB_API_KEY:     string;
    ADMIN_EMAIL:              string;
    ADMIN_FIREBASE_UID:       string;
    STRIPE_SECRET_KEY:        string;
    STRIPE_WEBHOOK_SECRET:    string;
    STRIPE_PRO_PRICE_ID:      string;
    STRIPE_ULTIMATE_PRICE_ID: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariable = [
        'NODE_ENV',
        'PORT',
        'APP_URL',
        'FRONTEND_URL',
        'DATABASE_URL',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_WEB_API_KEY',
        'ADMIN_EMAIL',
        'ADMIN_FIREBASE_UID',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'STRIPE_PRO_PRICE_ID',
        'STRIPE_ULTIMATE_PRICE_ID',
    ]

    requiredEnvVariable.forEach((variable) => {
        if (!process.env[variable]) {
            throw new AppError(
                status.INTERNAL_SERVER_ERROR,
                `Environment variable ${variable} is required but not set in .env file.`
            )
        }
    })

    return {
        NODE_ENV:                 process.env.NODE_ENV as string,
        PORT:                     process.env.PORT as string,
        APP_URL:                  process.env.APP_URL as string,
        FRONTEND_URL:             process.env.FRONTEND_URL as string,
        DATABASE_URL:             process.env.DATABASE_URL as string,
        FIREBASE_PROJECT_ID:      process.env.FIREBASE_PROJECT_ID as string,
        FIREBASE_CLIENT_EMAIL:    process.env.FIREBASE_CLIENT_EMAIL as string,
        FIREBASE_PRIVATE_KEY:     process.env.FIREBASE_PRIVATE_KEY as string,
        FIREBASE_WEB_API_KEY:     process.env.FIREBASE_WEB_API_KEY as string,
        ADMIN_EMAIL:              process.env.ADMIN_EMAIL as string,
        ADMIN_FIREBASE_UID:       process.env.ADMIN_FIREBASE_UID as string,
        STRIPE_SECRET_KEY:        process.env.STRIPE_SECRET_KEY as string,
        STRIPE_WEBHOOK_SECRET:    process.env.STRIPE_WEBHOOK_SECRET as string,
        STRIPE_PRO_PRICE_ID:      process.env.STRIPE_PRO_PRICE_ID as string,
        STRIPE_ULTIMATE_PRICE_ID: process.env.STRIPE_ULTIMATE_PRICE_ID as string,
    }
}

export const envVars = loadEnvVariables();