import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { IUser } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository';

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

  async login(email: string, password: string, token?: string) {
    const user = await this.userRepository.login(email, password);
    if (!user) {
      return { error: 'Invalid email or password' };
    }

    if (user.two_factor_secret) {
      if (!token) {
        return { error: '2FA token is required' };
      }
    }

    const is_valid = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token,
    });

    if (!is_valid) {
      return { error: 'Invalid 2FA token' };
    }

    return user;
  }

  async show(id: string) {
    return await this.userExists(id);
  }

  async update(id: string, user: Partial<IUser>) {
    const verify = await this.userExists(id);
    if ('error' in verify) {
      return verify;
    } else {
      return await this.userRepository.update(id, user);
    }
  }

  async remove(id: string) {
    const verify = await this.userExists(id);
    if ('error' in verify) {
      return verify;
    } else {
      return await this.userRepository.delete(id);
    }
  }

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
