const mongoose = require('mongoose');

// Use the same URI as your test DB (recommended to keep test data separate)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trekEnhance_test';

beforeAll(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // useNewUrlParser and useUnifiedTopology are no longer needed in latest mongoose
    });
    console.log('✅ Connected to test database');
  } catch (err) {
    console.error('❌ Could not connect to test database', err);
    process.exit(1); // exit tests if can't connect
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Disconnected from test database');
  } catch (err) {
    console.error('❌ Error disconnecting test database', err);
  }
});
