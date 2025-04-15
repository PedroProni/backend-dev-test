import User, { IUser } from '@domain/entities/user.entity';

export interface IUserRepository {
  index(): Promise<IUser[]>;
  show(id: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
    async index(): Promise<IUser[]> {
      return await User.find();
    }
  
    async show(id: string): Promise<IUser | null> {
      return await User.findById(id);
    }
  
    async create(user: IUser): Promise<IUser> {
      const newUser = new User(user);
      return await newUser.save();
    }
  
    async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
      return await User.findByIdAndUpdate(id, user, { new: true });
    }
  
    async delete(id: string): Promise<boolean> {
      const result = await User.findByIdAndDelete(id);
      return result !== null;
    }
  }