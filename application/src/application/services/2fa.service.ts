import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { IUserRepository } from '@domain/repositories/user.repository';
import { EmailService } from './email.service';

export class TwoFactorAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async enable2FA(id: string) {
    const user = await this.userRepository.show(id);
    if (!user) {
      return { error: 'User not found' };
    }

    const secret = speakeasy.generateSecret({ name: 'Proni-backend-dev' });
    user.two_factor_secret = secret.base32;
    await this.userRepository.update(id, { two_factor_secret: secret.base32 });

    const qr_code_base64 = await qrcode.toDataURL(secret.otpauth_url!);

    const emailService = new EmailService();
    await emailService.sendEmail(
      user.email,
      '🚀 Ative o 2FA 🚀',
      'Proteja sua conta com o 2FA!',
      `
    <div style="font-family: Comic Sans MS, Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 3px dashed #4CAF50; border-radius: 15px; background-color: #f0fff4;">
      <h1 style="color: #4CAF50; text-align: center;">🔒 Ative o 2FA 🔒</h1>
      <p style="font-size: 16px;">Olá <strong>${user.name}</strong>,</p>
      <p style="font-size: 16px;">Fiquei sabendo que alguém está querendo ficar mais protegido. (2FA).</p>
      <p style="font-size: 16px;">Scaneie o Código QR abaixo com o seu aplicativo autenticador(Google Authenticator, Authy, etc):</p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${qr_code_base64}" alt="QR Code" style="border: 3px solid #4CAF50; border-radius: 10px;" />
      </div>
      <p style="font-size: 16px;">Ou, caso eu não consiga arrumar a imagem quebrada, utilize a chave abaixo: <strong>${secret.base32}</strong></p>
      <p style="font-size: 16px; margin-top: 20px;">Continue seguro,</p>
      <p style="font-size: 16px;"><strong>Pedro Proni</strong> (Seu guia nessa aventura!)</p>
      <footer style="margin-top: 30px; font-size: 12px; text-align: center; color: #777;">
        <p>🚀 PS: Um dev bem humorado onde já se viu! 🌍</p>
      </footer>
    </div>
    `,
    );

    return { message: 'Email with instructions to activate the 2FA has been sent' };
  }

  async verify2FA(id: string, token: string) {
    const user = await this.userRepository.show(id);
    if (!user || !user.two_factor_secret) {
      return { error: '2FA is not enabled for this user' };
    }

    const is_valid = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token,
      window: 1,
    });

    return { is_valid };
  }

  async disable2FA(id: string) {
    const user = await this.userRepository.show(id);
    if (!user) {
      return { error: 'User not found' };
    }

    await this.userRepository.update(id, { two_factor_secret: null });
    return { message: '2FA disabled successfully' };
  }
}
