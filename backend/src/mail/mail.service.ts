import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendBookingConfirmationEmail(customerEmail: string, data: Record<string, unknown>) {
    return this.safeSend(customerEmail, 'Booking Confirmation', 'booking-confirmation', data);
  }

  async sendBookingStatusUpdateEmail(customerEmail: string, data: Record<string, unknown>) {
    return this.safeSend(customerEmail, 'Booking Status Updated', 'booking-status-update', data);
  }

  async sendFlightScheduleUpdateEmail(customerEmail: string, data: Record<string, unknown>) {
    return this.safeSend(customerEmail, 'Flight Schedule Updated', 'flight-schedule-update', data);
  }

  private async safeSend(
    to: string,
    subject: string,
    template: string,
    context: Record<string, unknown>,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        from: this.configService.getOrThrow<string>('MAIL_FROM'),
        subject,
        template,
        context,
      });
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Mail send failed: ${subject} to ${to}`, stack);
    }
  }
}
