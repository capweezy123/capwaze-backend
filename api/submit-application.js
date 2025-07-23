const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Create email content
    const emailContent = `
      <h2>🚀 New CapWaze Application</h2>
      
      <h3>👤 Contact Information</h3>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company}</p>
      
      <h3>🏢 Business Details</h3>
      <p><strong>Business Type:</strong> ${businessType || 'Not specified'}</p>
      <p><strong>Years in Business:</strong> ${businessAge || 'Not specified'}</p>
      <p><strong>Monthly Revenue:</strong> ${monthlyRevenue || 'Not specified'}</p>
      
      <h3>💰 Funding Information</h3>
      <p><strong>Funding Amount:</strong> ${fundingAmount}</p>
      <p><strong>Use of Funds:</strong> ${useOfFunds || 'Not specified'}</p>
      <p><strong>Timeframe:</strong> ${timeframe || 'Not specified'}</p>
      
      ${additionalInfo ? `<h3>📝 Additional Information</h3><p>${additionalInfo}</p>` : ''}
      
      <hr>
      <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
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
};
