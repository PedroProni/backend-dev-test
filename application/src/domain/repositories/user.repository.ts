import User, { IUser } from '@domain/entities/user.entity';
import bcrypt from 'bcrypt';

export interface IUserRepository {
  index(): Promise<IUser[]>;
  show(id: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  login(email: string, password: string): Promise<IUser | null>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async index(): Promise<IUser[]> {
    return await User.find({}, { password: 0 });
  }

  async show(id: string): Promise<IUser | null> {
    return await User.findById(id, { password: 0 });
  }

  async create(user: IUser): Promise<IUser> {
    const new_user = new User(user);
    return await new_user.save();
  }

  async login(email: string, password: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    const is_password_valid = await bcrypt.compare(password, user.password);
    if (!is_password_valid) {
      return null;
    }

    return user;
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    await User.findByIdAndUpdate(id, user, { new: true });
    return await User.findById(id, { password: 0 });
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }
}
