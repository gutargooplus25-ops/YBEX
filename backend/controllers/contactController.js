const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject and message are required' });
    }

    // Save to DB first — always succeeds regardless of email config
    const contact = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      subject,
      message,
    });

    // Log to server console
    console.log('\n📬 New Contact Form Submission');
    console.log('─────────────────────────────');
    console.log(`  Name:    ${name}`);
    console.log(`  Email:   ${email}`);
    if (phone) console.log(`  Phone:   ${phone}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Message: ${message}`);
    console.log('─────────────────────────────\n');

    // Send notification email — NON-BLOCKING, never fails the request
    sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Enquiry: ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${message}</p>
        </div>
      `,
    }).catch((err) => {
      // Log but never crash the request
      console.warn('⚠ Email notification skipped (check EMAIL_USER/EMAIL_PASS in .env):', err.message);
    });

    res.status(201).json({ success: true, message: 'Message sent successfully', contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts (admin)
// @route   GET /api/contact
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, getAllContacts };
