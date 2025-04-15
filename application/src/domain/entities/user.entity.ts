import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const User = mongoose.model<IUserDocument>('User', UserSchema);
export default User;