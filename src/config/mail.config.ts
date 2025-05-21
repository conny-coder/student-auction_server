import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getMailConfig = async (configService: ConfigService): Promise<MailerOptions> => ({
  transport: {
    host: configService.get('SMTP_HOST'),
    port: +configService.get<number>('SMTP_PORT'),
    auth: {
      user: configService.get('SMTP_USER'),
      pass: configService.get('SMTP_PASS'),
    },
  },
  defaults: {
    from: `"No Reply" <${configService.get('SMTP_FROM')}>`,
  },
  template: {
    dir: process.cwd() + '/src/templates',
    adapter: new (require('@nestjs-modules/mailer/dist/adapters/handlebars.adapter')).HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
