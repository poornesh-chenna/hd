import express,{Request, Response,} from 'express'
import { User } from '../models/users'
import { signJwtToken } from '../utils/jwt'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { transporter } from '../utils/nodemailer'

dotenv.config();

interface AuthRequestBody {
    email: string
    password: string
    firstname?: string
    lastname?: string
  }
  

interface otpConfig {
    [key:string]: {
        otp:string,
        expiresAt: Date
    }
}

const otpStore: otpConfig = {}

export const requsetOtp = async (req: Request<{}, {}, { email: string }>, res: Response) => {
    try {

      const foundUser = await User.findOne({ email: req.body.email })
      if (foundUser) {
        return res.status(400).json({ message: 'This email is already registered with us' })
      }
  
      // Generating OTP and store it temporarily with expiration time
      const otp = crypto.randomInt(100000, 999999).toString() // Generate 6-digit OTP
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // OTP expires in 5 minutes
      otpStore[req.body.email] = { otp, expiresAt }
      
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: 'Your OTP for Signup Verification',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      })
  
      res.status(200).json({ message: 'OTP sent to your email' })
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message })
    }
  }


  export const verifyOtp = async (req: Request<{}, {}, { email: string, otp: string }>, res: Response) => {
    const { email, otp } = req.body
    
    const storedOtpData = otpStore[email]
    
    if (!storedOtpData) {
      return res.status(400).json({ message: 'OTP not found, please request again' })
    }
    
    // Check if OTP is valid and not expired
    if (storedOtpData.otp !== otp || new Date() > storedOtpData.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }
    
    delete otpStore[email] // Remove OTP after successful verification
    
    return res.status(200).json({ message: 'OTP verified successfully, proceed with signup' })
  }


  export const signUp = async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    try {

      const { email } = req.body
  
      const foundUser = await User.findOne({ email: email })
      if (foundUser) {
        return res.status(400).json({ message: 'This email is already registered with us' })
      }
      
      const storedOtpData = otpStore[email]
      if (storedOtpData) {
        return res.status(400).json({ message: 'OTP not verified, please verify OTP first' })
      }
      
      const hashedPassword = await bcrypt.hash(req.body.password, 10) 
      
      
      const newUser = await new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
      }).save()
      
      
      const jwtToken = signJwtToken(newUser._id.toString())
      
      return res.status(200).json({
        message: 'Successfully registered',
        jwtToken: jwtToken, 
        userDetails: {
          username: req.body.firstname + ' ' + req.body.lastname,
          email: req.body.email
        }
      })
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message })
    }
  }


  export const signIn = async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    try {
      const foundUser = await User.findOne({ email: req.body.email })
      if (!foundUser) {
        return res.status(400).json({ message: 'Email is not registered with us' })
      }
  
      const isPasswordValid = await bcrypt.compare(req.body.password, foundUser.password)
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' })
      }
  
  
      const userId = foundUser._id.toString()
      const jwtToken = signJwtToken(userId)
  
      return res.status(200).json({
        message: 'User successfully authenticated',
        jwtToken: jwtToken,
        userDetails: {
          username: foundUser.firstname + ' ' + foundUser.lastname,
          email:req.body.email
        },
      })
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message })
    }
  }