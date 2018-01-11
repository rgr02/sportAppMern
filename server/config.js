const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://demo:demo@ds135537.mlab.com:35537/skiapp',
  //mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/sportAppDB',
  port: process.env.PORT || 8000,
};

export default config;