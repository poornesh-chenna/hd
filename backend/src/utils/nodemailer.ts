import nodemailer from 'nodemailer'
import dotenv from 'dotenv'


dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  })