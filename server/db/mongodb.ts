import mongoose from 'mongoose';

// MongoDB connection URI
// You'll need to provide your own MongoDB URI in the .env file
// Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_system';

// Connect to MongoDB
export const connectToMongoDB = async (): Promise<typeof mongoose> => {
  // Only attempt to connect if USE_MONGODB is set to true
  if (process.env.USE_MONGODB !== 'true') {
    console.log('MongoDB connection skipped - using PostgreSQL instead');
    return mongoose;
  }
  
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions;
    
    const connection = await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing with PostgreSQL as fallback');
    return mongoose;
  }
};

// Disconnect from MongoDB
export const disconnectFromMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};

// Export the mongoose instance
export default mongoose;