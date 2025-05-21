import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendUserConfirmation( email: string, token: string )
  {
    const url = `${process.env.API_SERVER_URL}/api/auth/confirm?token=${token}`;

    await this.mailer.sendMail( {
      to: email,
      subject: 'Підтвердіть ваш акаунт',
      template: 'confirmation',
      context: { name: email, url },
    } );
}
}
