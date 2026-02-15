require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB(process.env.MONGO_URI);

  const email = 'sumitraj00736@gmail.com';
  const name = 'sumit raj';
  const password = 'admin12345';

  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = name;
    existing.role = 'Admin';
    await existing.save();
    console.log('Admin updated:', email);
  } else {
    await User.create({ name, email, password, role: 'Admin' });
    console.log('Admin created:', email);
  }

  await mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
