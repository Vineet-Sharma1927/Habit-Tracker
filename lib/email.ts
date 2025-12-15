import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function createTransporter() {
  // Check if SMTP credentials are provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal Email for testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.warn('Unable to create Ethereal account, using mock mode');
    return null;
  }
}

async function sendEmail(options: EmailOptions) {
  const transporter = await createTransporter();

  if (!transporter) {
    // Mock mode - log to console
    console.log('📧 [MOCK EMAIL SERVICE]');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(options.text);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { success: true, mode: 'mock' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Habit Tracker" <noreply@habittracker.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    // If using Ethereal, log the preview URL
    if (info.messageId && !process.env.SMTP_HOST) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 Email sent (Ethereal Test)');
      console.log(`Preview URL: ${previewUrl}`);
      return { success: true, mode: 'ethereal', previewUrl };
    }

    console.log('📧 Email sent successfully:', info.messageId);
    return { success: true, mode: 'smtp', messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendReminderEmail(email: string, habitName: string) {
  const subject = `⏰ Don't forget your habit: ${habitName}`;
  
  const text = `
Hi there!

This is a friendly reminder about your habit: "${habitName}"

You haven't checked in today yet. Keep your streak going!

Best regards,
Habit Tracker Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">⏰ Habit Reminder</h2>
      <p>Hi there!</p>
      <p>This is a friendly reminder about your habit:</p>
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <strong style="font-size: 18px; color: #1f2937;">${habitName}</strong>
      </div>
      <p>You haven't checked in today yet. Keep your streak going!</p>
      <p style="margin-top: 24px;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Check In Now
        </a>
      </p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
        Best regards,<br/>
        Habit Tracker Team
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

export async function sendBulkReminderEmails(reminders: { email: string; habitName: string }[]) {
  const results = [];
  
  for (const reminder of reminders) {
    const result = await sendReminderEmail(reminder.email, reminder.habitName);
    results.push({
      email: reminder.email,
      habitName: reminder.habitName,
      ...result,
    });
  }

  return results;
}
