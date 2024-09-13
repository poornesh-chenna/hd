import mongoose, { Document, Model, Schema } from 'mongoose'

interface IUser extends Document {
  firstname: string
  lastname: string
  email: string
  password: string
}

const UserSchema: Schema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)
