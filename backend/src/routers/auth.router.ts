import express from 'express'
import { requsetOtp, signIn, signUp, verifyOtp } from '../controllers/authControllers'

const router = express.Router()


router.post('/request-otp', requsetOtp)

router.post('/verify-otp', verifyOtp)


router.post('/signup', signUp)

router.post('/signin', signIn)

export const AuthRouters = router
