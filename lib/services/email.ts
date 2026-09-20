import { Resend } from 'resend';

export const sendAdminNotificationEmail = async (subject: string, htmlContent: string) => {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const fromEmail = process.env.ADMIN_EMAIL_FROM;

    if (!resendApiKey || !adminEmail || !fromEmail) {
      console.log('Email skipped: RESEND_API_KEY, ADMIN_NOTIFICATION_EMAIL, or ADMIN_EMAIL_FROM is not configured.');
      return false;
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: `VECTOR-X Notifications <${fromEmail}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Failed to send admin notification email:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
};
