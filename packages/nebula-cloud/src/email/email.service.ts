import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter | null = null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');

    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get<string>('SMTP_PORT', '587')),
        secure: this.config.get<string>('SMTP_SECURE', 'false') === 'true',
        auth: {
          user: this.config.get<string>('SMTP_USER', ''),
          pass: this.config.get<string>('SMTP_PASS', ''),
        },
      });
      this.from = this.config.get<string>(
        'SMTP_FROM',
        'Nebula <noreply@nebula.local>',
      );
      this.logger.log(`SMTP transport configured for ${host}`);
    } else {
      this.from = 'Nebula <noreply@nebula.local>';
      this.logger.warn(
        'SMTP_HOST not configured — emails will be logged to console only',
      );
    }
  }

  async sendPasswordResetEmail(
    to: string,
    displayName: string,
    resetUrl: string,
  ): Promise<void> {
    const subject = 'Reset your Nebula Console password';
    const html = buildPasswordResetHtml(displayName, resetUrl);

    if (this.transporter) {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } else {
      this.logger.log(
        `[DEV] Password reset link for ${to} (${displayName}):\n  ${resetUrl}`,
      );
    }
  }
}

// Base64-encoded nebula-logo.svg for email compatibility
const LOGO_BASE64 =
  'PHN2ZyB3aWR0aD0iNTUwcHgiIGhlaWdodD0iNTUwcHgiIHZpZXdCb3g9IjAgMCA1NTAgNTUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOmJ4PSJodHRwczovL2JveHktc3ZnLmNvbSI+CiAgPGRlZnM+CiAgICA8Yng6Z3VpZGUgeD0iMTAwLjE0NSIgeT0iMzIyLjAyOSIgYW5nbGU9IjAiLz4KICAgIDxieDpndWlkZSB4PSIxNTkuNjA4IiB5PSIzMzkuMzA2IiBhbmdsZT0iMCIvPgogICAgPGJ4Omd1aWRlIHg9IjIyMy45MDkiIHk9IjM5My4yODIiIGFuZ2xlPSI5MCIvPgogICAgPGJ4Omd1aWRlIHg9IjI3MC4zMzQiIHk9IjEzOS45NjciIGFuZ2xlPSIwIi8+CiAgICA8Yng6Z3VpZGUgeD0iNDUwLjA1MyIgeT0iOC4xOTgiIGFuZ2xlPSIwIi8+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI1NTAiIGhlaWdodD0iNTUwIiByeD0iMTIwIiBzdHlsZT0iIiBmaWxsPSIjMDkwOTBCIiB5PSIwLjgxMiIgeD0iLTAuMjU0Ii8+CiAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMS4yNzkzMzEsIDAsIC0wLjk1MjYxOCwgMS40MzEzNDgsIDE3My42NTc2MDgsIC0xMDkuNzczMTQpIiBzdHlsZT0iIj4KICAgIDxwYXRoIGQ9Ik0gMTc2LjAwMSAzNTEuNDM2IEwgMTc2LjAwMSAxODMuMDg1IEwgMjIxLjg1OSAxODMuMDg1IEwgMzA2LjUxOSAyOTIuNTEzIEwgMzA2LjUxOSAxODMuMDg1IEwgMzUyLjM3NiAxODMuMDg1IEwgMzUyLjM3NiAzNTEuNDM2IEwgMzA2LjUxOSAzNTEuNDM2IEwgMjIxLjg1OSAyNDIuMDA4IEwgMjIxLjg1OSAzNTEuNDM2IEwgMTc2LjAwMSAzNTEuNDM2IFoiIHN0eWxlPSIiIGZpbGw9IiNGQUZBRkEiLz4KICA8L2c+CiAgPHJlY3Qgd2lkdGg9IjEyMy41MDgiIGhlaWdodD0iNjIuNzI2IiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBmaWxsOiByZ2IoMCwgMCwgMCk7IiB4PSI2Mi4yMDgiIHk9IjMzOS4xOTQiLz4KICA8cmVjdCB3aWR0aD0iNTkuNTc1IiBoZWlnaHQ9IjI3LjY1NSIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyIgeD0iMTAwLjE0NSIgeT0iMzY1LjYyNyIvPgo8L3N2Zz4=';

function buildPasswordResetHtml(displayName: string, resetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f9fafb;">
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <img src="data:image/svg+xml;base64,${LOGO_BASE64}" alt="Nebula" width="48" height="48" style="display: inline-block; border-radius: 10px;" />
    <div style="margin-top: 8px; font-size: 24px; font-weight: 700; letter-spacing: -0.04em; color: #111827;">Nebula</div>
  </div>
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px;">
    <h1 style="margin: 0 0 8px; font-size: 20px; font-weight: 600; color: #111827;">Reset your password</h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280; line-height: 1.5;">
      Hi ${escapeHtml(displayName)}, we received a request to reset the password for your Nebula Console account.
    </p>
    <a href="${escapeHtml(resetUrl)}"
       style="display: block; text-align: center; padding: 12px 24px;
              background: #111827; color: #ffffff; border-radius: 8px;
              text-decoration: none; font-weight: 500; font-size: 14px;">
      Reset Password
    </a>
    <p style="margin: 24px 0 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
      This link will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.
    </p>
  </div>
  <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #9ca3af;">
    Nebula Console &middot; Password Reset
  </p>
</div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
