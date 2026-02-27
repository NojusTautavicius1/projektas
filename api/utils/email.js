import { createTransport } from 'nodemailer';

// Create email transporter
// For Gmail, you'll need to:
// 1. Enable 2-factor authentication on your Gmail account
// 2. Generate an "App Password" from https://myaccount.google.com/apppasswords
// 3. Use that app password instead of your regular password

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'nojustautavicius007@gmail.com', 
    pass: process.env.EMAIL_PASSWORD || 'uijq henm pzyf aiol' 
  }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Send email notification for new contact message
export const sendContactNotification = async (name, email, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'nojustautavicius007@gmail.com',
    to: 'nojustautavicius007@gmail.com', // Your email to receive notifications
    subject: `New Contact Form Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong style="color: #374151;">Name:</strong> ${name}</p>
          <p><strong style="color: #374151;">Email:</strong> ${email}</p>
          <p><strong style="color: #374151;">Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Reply to:</strong> <a href="mailto:${email}">${email}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="color: #9ca3af; font-size: 12px;">
          This message was sent from your portfolio contact form.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default transporter;
