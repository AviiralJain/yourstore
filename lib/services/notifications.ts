import connectToDatabase from '@/lib/db/mongodb';
import Notification from '@/lib/models/Notification';
import { sendAdminNotificationEmail } from './email';

interface NotificationPayload {
  type: 'new_project_enquiry' | 'enquiry_status_changed' | 'security' | 'system';
  title: string;
  message: string;
  enquiryId?: string;
  link?: string;
  emailContent?: {
    name?: string;
    email?: string;
    phone?: string;
    userType?: string;
    projectDomain?: string;
    projectTitle?: string;
    timeline?: string;
    description?: string;
  };
}

// Simple HTML escaper
const escapeHtml = (unsafe?: string) => {
  if (!unsafe) return '-';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const createNotification = async (payload: NotificationPayload) => {
  try {
    await connectToDatabase();
    
    // 1. Create DB Notification
    await Notification.create({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      enquiryId: payload.enquiryId,
      link: payload.link,
      read: false
    });

    // 2. Handle Email if it's a new enquiry
    if (payload.type === 'new_project_enquiry' && payload.emailContent) {
      // Prioritize NEXT_PUBLIC_SITE_URL as requested
      const appUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || '';
      // Remove trailing slash if present for clean concatenation
      const cleanAppUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
      const actionUrl = payload.link ? `${cleanAppUrl}${payload.link.startsWith('/') ? payload.link : '/' + payload.link}` : `${cleanAppUrl}/admin/project-enquiries`;
      
      const safeName = escapeHtml(payload.emailContent.name);
      const safeEmail = escapeHtml(payload.emailContent.email);
      const safePhone = escapeHtml(payload.emailContent.phone);
      const safeUserType = escapeHtml(payload.emailContent.userType);
      const safeProjectDomain = escapeHtml(payload.emailContent.projectDomain);
      const safeProjectTitle = escapeHtml(payload.emailContent.projectTitle);
      const safeTimeline = escapeHtml(payload.emailContent.timeline);
      const safeDescription = escapeHtml(payload.emailContent.description);

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #080c16; border-bottom: 2px solid #5171FA; padding-bottom: 10px; margin-bottom: 20px;">NEW PROJECT ENQUIRY</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
              <tr><td style="padding: 8px 0; font-weight: bold; width: 35%;">Name</td><td style="padding: 8px 0;">${safeName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td style="padding: 8px 0;">${safeEmail}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone</td><td style="padding: 8px 0;">${safePhone}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">User Type</td><td style="padding: 8px 0;">${safeUserType}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Project Domain</td><td style="padding: 8px 0;">${safeProjectDomain}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Project Title</td><td style="padding: 8px 0;">${safeProjectTitle}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Timeline</td><td style="padding: 8px 0;">${safeTimeline}</td></tr>
            </tbody>
          </table>
          
          <div style="margin-bottom: 30px;">
            <p style="font-weight: bold; margin-bottom: 8px;">Description</p>
            <p style="background: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-wrap; font-family: monospace;">${safeDescription}</p>
          </div>

          <div style="text-align: center;">
            <a href="${actionUrl}" style="background-color: #5171FA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">VIEW ENQUIRY</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #777; text-align: center;">
            This is an automated notification from VECTOR-X Solutions.
          </div>
        </div>
      `;

      // Non-blocking email attempt
      sendAdminNotificationEmail('New Project Enquiry — VECTOR-X Solutions', htmlContent).catch(err => {
        console.error('Non-blocking email failure in createNotification:', err instanceof Error ? err.message : 'Unknown error');
      });
    }

  } catch (error) {
    console.error('Failed to create notification in DB:', error instanceof Error ? error.message : 'Unknown error');
  }
};
