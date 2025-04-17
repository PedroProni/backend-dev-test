import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  two_factor_secret?: string;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    two_factor_secret: { type: String },
  },
  { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const User = mongoose.model<IUserDocument>('User', UserSchema);
export default User;