"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
let MailService = MailService_1 = class MailService {
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
    }
    async sendBookingConfirmationEmail(customerEmail, data) {
        return this.safeSend(customerEmail, 'Booking Confirmation', 'booking-confirmation', data);
    }
    async sendBookingStatusUpdateEmail(customerEmail, data) {
        return this.safeSend(customerEmail, 'Booking Status Updated', 'booking-status-update', data);
    }
    async sendFlightScheduleUpdateEmail(customerEmail, data) {
        return this.safeSend(customerEmail, 'Flight Schedule Updated', 'flight-schedule-update', data);
    }
    async safeSend(to, subject, template, context) {
        try {
            await this.mailerService.sendMail({
                to,
                from: this.configService.getOrThrow('MAIL_FROM'),
                subject,
                template,
                context,
            });
        }
        catch (error) {
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Mail send failed: ${subject} to ${to}`, stack);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map