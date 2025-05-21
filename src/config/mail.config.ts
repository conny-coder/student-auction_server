import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getMailConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  console.log('→ SMTP_HOST:', configService.get('SMTP_HOST'));
  console.log('→ SMTP_PORT:', configService.get('SMTP_PORT'));
  console.log('→ SMTP_USER:', configService.get('SMTP_USER'));
  console.log('→ SMTP_PASS:', configService.get('SMTP_PASS'));
  console.log('→ SMTP_FROM:', configService.get('SMTP_FROM'));

  return {
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
      adapter: new (require('@nestjs-modules/mailer/dist/adapters/handlebars.adapter'))
        .HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
