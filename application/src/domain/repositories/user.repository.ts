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
      '🚀 Bem vindo ao clube dos devs incríveis! 🚀',
      'Prepare-se para uma jornada épica!',
      `
      <div style="font-family: Comic Sans MS, Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 3px dashed #4CAF50; border-radius: 15px; background-color: #f0fff4;">
      <h1 style="color: #4CAF50; text-align: center;">🎉 Bem vindo ao clube dos devs incríveis! 🎉</h1>
      <p style="font-size: 16px;">Olá <strong>${user.name}</strong>,</p>
      <p style="font-size: 16px;">Você acaba de desbloquear o nível <strong>Iniciante Supremo</strong> no meu aplicativo! 🏆</p>
      <p style="font-size: 16px;">Aqui estão algumas missões que você pode completar:</p>
      <ul style="font-size: 16px; padding-left: 20px;">
      <li>👤 Cadastrar novos usuários (porque mais é sempre melhor).</li>
      <li>🔍 Espiar... digo, ver usuários cadastrados.</li>
      <li>✏️ Atualizar informações (ninguém é perfeito, certo?).</li>
      <li>🗑️ Deletar usuários (mas só se for realmente necessário).</li>
      </ul>
      <p style="font-size: 16px;">E o melhor de tudo? Sim, essa API manda e-mails estilosos como este! 😎</p>
      <p style="font-size: 16px; margin-top: 20px;">Prepare-se para dominar o mundo dos devs,</p>
      <p style="font-size: 16px;"><strong>Pedro Proni</strong> (Seu guia nessa aventura!)</p>
      <footer style="margin-top: 30px; font-size: 12px; text-align: center; color: #777;">
      <p>🚀 PS: Me contrata e vamos conquistar o mundo juntos! 🌍</p>
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
