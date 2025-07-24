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
      dateOfBirth,
      personalStreet,
      personalCity,
      personalState,
      personalZipCode,
      company,
      businessType,
      businessStartDate,
      monthlyRevenue,
      businessStreet,
      businessCity,
      businessState,
      businessZip,
      blankField1,
      blankField2,
      fundingAmount,
      useOfFunds,
      timeframe,
      additionalInfo,
      timestamp
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

    // Helper function to format date
    const formatDate = (dateString) => {
      if (!dateString) return 'Not provided';
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateString;
      }
    };

    // Helper function to format address
    const formatAddress = (street, city, state, zip) => {
      const parts = [street, city, state, zip].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : 'Not provided';
    };

    // Log all received data for debugging
    console.log('All form data received:', req.body);

    // Create beautiful email content
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10B981, #34D399); color: white; padding: 25px; border-radius: 12px 12px 0 0; text-align: center; }
          .header h1 { margin: 0 0 10px 0; font-size: 28px; }
          .header p { margin: 0; opacity: 0.9; font-size: 16px; }
          .content { background: #f8f9fa; padding: 0; }
          .section { background: white; margin: 0; padding: 20px; border-bottom: 1px solid #e5e7eb; }
          .section:last-of-type { border-bottom: none; }
          .section h3 { color: #10B981; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center; }
          .section h3::before { content: ''; width: 4px; height: 20px; background: #10B981; margin-right: 10px; border-radius: 2px; }
          .field-row { display: flex; margin: 8px 0; }
          .field-row.full-width { flex-direction: column; }
          .label { font-weight: bold; color: #374151; min-width: 140px; flex-shrink: 0; }
          .value { color: #1f2937; flex: 1; }
          .value a { color: #10B981; text-decoration: none; }
          .value a:hover { text-decoration: underline; }
          .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
          .footer { background: #374151; color: white; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; }
          .footer p { margin: 5px 0; }
          .additional-info { background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #10B981; margin-top: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          @media (max-width: 600px) {
            .grid { grid-template-columns: 1fr; }
            .field-row { flex-direction: column; }
            .label { min-width: auto; margin-bottom: 2px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 NEW CAPWAZE APPLICATION</h1>
            <p>Complete application details below</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>👤 PERSONAL INFORMATION</h3>
              <div class="field-row">
                <span class="label">Full Name:</span>
                <span class="value"><strong>${firstName || 'Not provided'} ${lastName || 'Not provided'}</strong></span>
              </div>
              <div class="field-row">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${email || ''}">${email || 'Not provided'}</a></span>
              </div>
              <div class="field-row">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:${phone || ''}">${phone || 'Not provided'}</a></span>
              </div>
              <div class="field-row">
                <span class="label">Date of Birth:</span>
                <span class="value">${formatDate(dateOfBirth)}</span>
              </div>
              <div class="field-row">
                <span class="label">Personal Address:</span>
                <span class="value">${formatAddress(personalStreet, personalCity, personalState, personalZipCode)}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>🏢 BUSINESS INFORMATION</h3>
              <div class="field-row">
                <span class="label">Company Name:</span>
                <span class="value"><strong>${company || 'Not provided'}</strong></span>
              </div>
              <div class="field-row">
                <span class="label">Business Type/Industry:</span>
                <span class="value">${businessType || 'Not specified'}</span>
              </div>
              <div class="field-row">
                <span class="label">Business Start Date:</span>
                <span class="value">${formatDate(businessStartDate)}</span>
              </div>
              <div class="field-row">
                <span class="label">Monthly Revenue:</span>
                <span class="value">${monthlyRevenue || 'Not specified'}</span>
              </div>
              <div class="field-row">
                <span class="label">Business Address:</span>
                <span class="value">${formatAddress(businessStreet, businessCity, businessState, businessZip)}</span>
              </div>
              ${blankField1 || blankField2 ? `
                <div class="field-row">
                  <span class="label">Additional Field 1:</span>
                  <span class="value">${blankField1 || 'Not provided'}</span>
                </div>
                <div class="field-row">
                  <span class="label">Additional Field 2:</span>
                  <span class="value">${blankField2 || 'Not provided'}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="section">
              <h3>💰 FUNDING REQUIREMENTS</h3>
              <div class="field-row">
                <span class="label">Amount Needed:</span>
                <span class="value highlight">${fundingAmount || 'Not specified'}</span>
              </div>
              <div class="field-row">
                <span class="label">Use of Funds:</span>
                <span class="value">${useOfFunds || 'Not specified'}</span>
              </div>
              <div class="field-row">
                <span class="label">Timeframe:</span>
                <span class="value">${timeframe || 'Not specified'}</span>
              </div>
              ${additionalInfo ? `
                <div class="additional-info">
                  <strong>Additional Information:</strong><br>
                  ${additionalInfo.replace(/\n/g, '<br>')}
                </div>
              ` : ''}
            </div>

            <div class="section">
              <h3>📊 QUICK SUMMARY</h3>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                <p><strong>Applicant:</strong> ${firstName || ''} ${lastName || ''} (${email || ''})</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Funding Request:</strong> ${fundingAmount || 'Not specified'}</p>
                <p><strong>Business Type:</strong> ${businessType || 'Not specified'}</p>
                <p><strong>Urgency:</strong> ${timeframe || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>📅 Submitted:</strong> ${new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            })}</p>
            <p><strong>🌐 Source:</strong> CapWaze Contact Form (capwaze.com)</p>
            <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
              🔥 <strong>Action Required:</strong> Follow up with ${firstName || 'applicant'} within 24 hours
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'leo@capwaze.com',
      subject: `🔥 NEW LEAD: ${company} requesting ${fundingAmount} - ${firstName} ${lastName}`,
      html: emailContent
    });

    console.log('Email sent successfully to leo@capwaze.com');
    console.log('Application data:', {
      name: `${firstName} ${lastName}`,
      company,
      email,
      phone,
      fundingAmount,
      businessType,
      timeframe
    });

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