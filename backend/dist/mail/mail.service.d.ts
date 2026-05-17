import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
export declare class MailService {
    private readonly mailerService;
    private readonly configService;
    private readonly logger;
    constructor(mailerService: MailerService, configService: ConfigService);
    sendBookingConfirmationEmail(customerEmail: string, data: Record<string, unknown>): Promise<void>;
    sendBookingStatusUpdateEmail(customerEmail: string, data: Record<string, unknown>): Promise<void>;
    sendFlightScheduleUpdateEmail(customerEmail: string, data: Record<string, unknown>): Promise<void>;
    private safeSend;
}
