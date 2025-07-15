const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      businessType,
      businessAge,
      monthlyRevenue,
      fundingAmount,
      useOfFunds,
      timeframe,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !company || !fundingAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Email configuration
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Create beautiful email content
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10B981, #34D399); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 20px; }
          .section { background: white; margin: 15px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #10B981; }
          .label { font-weight: bold; color: #10B981; }
          .value { margin-left: 10px; }
          .footer { background: #e5e7eb; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New CapWaze Application</h1>
            <p>A new funding application has been submitted</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3 style="color: #10B981; margin-top: 0;">👤 Contact Information</h3>
              <p><span class="label">Name:</span><span class="value">${firstName} ${lastName}</span></p>
              <p><span class="label">Email:</span><span class="value"><a href="mailto:${email}">${email}</a></span></p>
              <p><span class="label">Phone:</span><span class="value"><a href="tel:${phone}">${phone}</a></span></p>
              <p><span class="label">Company:</span><span class="value">${company}</span></p>
            </div>
            
            <div class="section">
              <h3 style="color: #10B981; margin-top: 0;">🏢 Business Details</h3>
              <p><span class="label">Business Type:</span><span class="value">${businessType || 'Not specified'}</span></p>
              <p><span class="label">Years in Business:</span><span class="value">${businessAge || 'Not specified'}</span></p>
              <p><span class="label">Monthly Revenue:</span><span class="value">${monthlyRevenue || 'Not specified'}</span></p>
            </div>
            
            <div class="section">
              <h3 style="color: #10B981; margin-top: 0;">💰 Funding Information</h3>
              <p><span class="label">Funding Amount:</span><span class="value"><strong>${fundingAmount}</strong></span></p>
              <p><span class="label">Use of Funds:</span><span class="value">${useOfFunds || 'Not specified'}</span></p>
              <p><span class="label">Timeframe:</span><span class="value">${timeframe || 'Not specified'}</span></p>
            </div>
            
            ${additionalInfo ? `
              <div class="section">
                <h3 style="color: #10B981; margin-top: 0;">📝 Additional Information</h3>
                <p>${additionalInfo}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Source:</strong> CapWaze Contact Form</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'leo@capwaze.com',
      subject: `🔥 New CapWaze Lead: ${company} (${fundingAmount})`,
      html: emailContent
    });

    console.log('Email sent successfully to leo@capwaze.com');

    // Success response
    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application. Please try again.' 
    });
  }
}