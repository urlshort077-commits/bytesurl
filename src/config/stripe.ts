import Stripe from 'stripe';
import { envVars } from './envVars';

export const stripe = new Stripe(envVars.STRIPE_SECRET_KEY)