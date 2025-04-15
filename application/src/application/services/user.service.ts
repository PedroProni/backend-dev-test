import { IUser } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/repositories/user.repository";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}
  
    async index(): Promise<IUser[]> {
      return await this.userRepository.index();
    }
  
    async show(id: string): Promise<IUser | null> {
      return await this.userRepository.show(id);
    }
  
    async create(user: IUser): Promise<IUser> {
      return await this.userRepository.create(user);
    }
  
    async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
      return await this.userRepository.update(id, user);
    }
  
    async remove(id: string): Promise<boolean> {
      return await this.userRepository.delete(id);
    }
  }