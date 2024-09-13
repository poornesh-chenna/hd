import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './utils/initMongoose'
import { AuthRouters } from './routers/auth.router'


dotenv.config()

const app = express()

// Middleware for JSON and CORS
app.use(express.json())
app.use(cors())

// CONNECT TO MONGODB DATABASE SERVER
const startServer = async () => {
  try {
    await connectDatabase()
  } catch (err) {
    console.error('Database connection error:', err)
    process.exit(1)
  }

  // Server health check endpoint
  app.get('/check', (req: Request, res: Response) => {
    res.send('<h1>Server is running</h1>')
  })

  // Authentication routes (login and signup)
  app.use(AuthRouters)

  // Start listening on port 3005
  app.listen(3005, () => {
    console.log('Server running on port 3005')
  })
}

startServer()
