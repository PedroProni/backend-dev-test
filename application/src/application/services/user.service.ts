import { IUser } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async index() {
    return await this.userRepository.index();
  }

  async create(user: IUser) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return await this.userRepository.create(user);
  }

  async show(id: string) {
    return await this.userExists(id);
  }

  async update(id: string, user: Partial<IUser>) {
    await this.userExists(id);
    return await this.userRepository.update(id, user);
  }

  async remove(id: string) {
    await this.userExists(id);
    return await this.userRepository.delete(id);
  }

  //Métodos auxiliares

  async userExists(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'The provided ID is not valid. Please provide a valid ID.' };
    }
    const user = await this.userRepository.show(id);
    if (!user) {
      return { error: 'User not found' };
    }
    return user;
  }
}
