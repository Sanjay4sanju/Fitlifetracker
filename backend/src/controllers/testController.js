export const testAPI = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API test failed',
      error: error.message
    });
  }
};

export const testDatabase = async (req, res) => {
  try {
    const { sequelize } = await import('../models/index.js');
    await sequelize.authenticate();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      database: sequelize.config.database
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};

export const testAuth = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Auth endpoint is working!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Auth test failed',
      error: error.message
    });
  }
};