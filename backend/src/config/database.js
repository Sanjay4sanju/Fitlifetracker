import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

if (process.env.NODE_ENV === 'test') {
  // 🧪 Use SQLite for tests to avoid PostgreSQL ENUM issues
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    define: {
      timestamps: true
    }
  });
} else if (process.env.NODE_ENV === 'production') {
  // 🚀 Production configuration for Render - FIXED VERSION
  const dbConfig = {
    database: process.env.DB_NAME || process.env.DATABASE_NAME,
    username: process.env.DB_USER || process.env.DATABASE_USER,
    password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD,
    host: process.env.DB_HOST || process.env.DATABASE_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  console.log('🔧 Database config:', { 
    host: dbConfig.host,
    database: dbConfig.database,
    user: dbConfig.username 
  });
  
  sequelize = new Sequelize(dbConfig);
} else {
  // 💻 Development configuration
  sequelize = new Sequelize(
    process.env.DB_NAME || 'fitlifetracker',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// ✅ Test database connection when backend starts
(async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connected successfully.');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔧 Connection details:', {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      port: process.env.DB_PORT
    });
  }
})();

export default sequelize;
