module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV,
    API_TOKEN: process.env.NOTEFUL_SERVER_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:SpiDee11@localhost/noteful"
  }