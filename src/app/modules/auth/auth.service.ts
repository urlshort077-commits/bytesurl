import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import admin from '../../../config/firebase';
import { envVars } from '../../../config/envVars';
import status from 'http-status';
import { Plan, UserStatus } from '../../../../generated/prisma/enums';

const registerUser = async (data: {
    email:     string
    password:  string
    name:      string
    avatarUrl?: string
}) => {
    let firebaseUser
    try {
        firebaseUser = await admin.auth().createUser({
            email:       data.email,
            password:    data.password,
            displayName: data.name,
            photoURL:    data.avatarUrl,
        })
    } catch (err: any) {
        if (err.code === 'auth/email-already-exists') {
            throw new AppError(status.CONFLICT, 'Email already exists')
        }
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to create user')
    }

    let user
    try {
        user = await prisma.user.create({
            data: {
                firebaseUid: firebaseUser.uid,
                email:       data.email,
                name:        data.name,
                avatarUrl:   data.avatarUrl ?? null,
            }
        })
    } catch (err) {
        await admin.auth().deleteUser(firebaseUser.uid)
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'Registration failed')
    }

    try {
        await prisma.subscriptions.create({
            data: {
                userId:      user.id,
                plan:        Plan.FREE,
                urlLimit:    10,
                urlsCreated: 0,
            }
        })
    } catch (err) {
        await prisma.user.delete({ where: { id: user.id } })
        await admin.auth().deleteUser(firebaseUser.uid)
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'Registration failed')
    }

    return prisma.user.findUnique({
        where:   { id: user.id },
        include: { subscription: true }
    })
}

const loginUser = async (data: {
    email:    string
    password: string
}) => {
    const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${envVars.FIREBASE_WEB_API_KEY}`,
        {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                email:             data.email,
                password:          data.password,
                returnSecureToken: true,
            })
        }
    )

    const result = await response.json()

    if (!response.ok) {
        const errorCode = result.error?.message
        if (
            errorCode === 'INVALID_PASSWORD'          ||
            errorCode === 'EMAIL_NOT_FOUND'           ||
            errorCode === 'INVALID_LOGIN_CREDENTIALS'
        ) {
            throw new AppError(status.UNAUTHORIZED, 'Invalid credentials')
        }
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'Login failed')
    }

    const user = await prisma.user.findUnique({
        where:   { email: data.email },
        include: { subscription: true }
    })
    if (!user) throw new AppError(status.NOT_FOUND, 'User not found')
    if (user.status === UserStatus.SUSPENDED) {
        throw new AppError(status.FORBIDDEN, 'Account suspended')
    }

    return {
        token: result.idToken,
        user,
    }
}

const googleAuth = async (data: {
    firebaseUid: string
    email:       string
    name:        string
    avatarUrl?:  string
}) => {
    const existingUser = await prisma.user.findUnique({
        where:   { firebaseUid: data.firebaseUid },
        include: { subscription: true }
    })
    if (existingUser) return existingUser

    let user
    try {
        user = await prisma.user.create({
            data: {
                firebaseUid: data.firebaseUid,
                email:       data.email,
                name:        data.name,
                avatarUrl:   data.avatarUrl ?? null,
            }
        })
    } catch (err) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'Google auth failed')
    }

    try {
        await prisma.subscriptions.create({
            data: {
                userId:      user.id,
                plan:        Plan.FREE,
                urlLimit:    10,
                urlsCreated: 0,
            }
        })
    } catch (err) {
        await prisma.user.delete({ where: { id: user.id } })
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'Google auth failed')
    }

    return prisma.user.findUnique({
        where:   { id: user.id },
        include: { subscription: true }
    })
}

export const authService = {
    registerUser,
    loginUser,
    googleAuth,
}