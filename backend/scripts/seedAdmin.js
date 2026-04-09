/**
 * Run once: node backend/scripts/seedAdmin.js
 * Creates the predefined owner admin account.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const User = require('../models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const email = 'gutargooplus25@gmail.com';
  const existing = await User.findOne({ email });

  if (existing) {
    // Ensure role is admin
    existing.role = 'admin';
    existing.password = '1234567890';
    await existing.save();
    console.log('✅ Admin updated:', email);
  } else {
    await User.create({
      name: 'GUTARGOOPLUS25',
      email,
      password: '1234567890',
      role: 'admin',
      isVerified: true,
    });
    console.log('✅ Admin created:', email);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
