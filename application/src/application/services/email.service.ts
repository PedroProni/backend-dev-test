import nodemailer from 'nodemailer';

export class EmailService {
    private transporter;

    constructor() {
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = parseInt(process.env.SMTP_PORT || '587');
        const smtpUser = process.env.GMAIL_USER;
        const smtpPass = process.env.GMAIL_PASS;

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: false,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        try {
            const mailOptions = {
                from: `"Pedro Proni" <${process.env.GMAIL_USER}>`,
                to,
                subject,
                text,
                html,
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('❌ Error sending email:', error);
        }
    }
}