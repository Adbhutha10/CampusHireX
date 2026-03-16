import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'no-key-set');
export const SENDER_EMAIL = 'onboarding@resend.dev';
