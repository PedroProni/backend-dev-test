import User, { IUser } from '@domain/entities/user.entity';
import bcrypt from 'bcrypt';
import { EmailService } from '@application/services/email.service';

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
    const saved_user = await new_user.save();
    const email_service = new EmailService();
    await email_service.sendEmail(
      user.email,
      '🎉 Bem vindo ao meu aplicativo! 🎉',
      'Esta é a mensagem de boas vindas!',
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h1 style="color: #4CAF50; text-align: center;">Bem vindo ao meu aplicativo!</h1>
      <p style="font-size: 16px;">Olá <strong>${user.name}</strong>,</p>
      <p style="font-size: 16px;">Se você está vendo essa mensagem, quer dizer que meu e-mail está funcionando :)</p>
      <p style="font-size: 16px;">Coisas que você pode fazer dentro da API:</p>
      <ul style="font-size: 16px; padding-left: 20px;">
        <li>Cadastrar usuários.</li>
        <li>Ver usuários.</li>
        <li>Modificar usuários.</li>
        <li>Deletar usuários.</li>
      </ul>
      <p style="font-size: 16px;">Uau que API incrivel além de ter validações de erro ela manda um e-mail no cadastro?</p>
      <p style="font-size: 16px; margin-top: 20px;">Bem vindo,</p>
      <p style="font-size: 16px;"><strong>Pedro Proni</strong></p>
      <footer style="margin-top: 30px; font-size: 12px; text-align: center; color: #777;">
        <p>Me contrata!.</p>
      </footer>
      </div>
      `
    );
    return saved_user;
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
