const mongoose = require('mongoose');

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MONGO_URI missing');
  }
  await mongoose.connect(uri);
};

module.exports = connectDB;
