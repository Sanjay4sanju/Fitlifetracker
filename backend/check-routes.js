import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Checking route files...');

const routesPath = join(__dirname, 'src', 'routes');
const files = fs.readdirSync(routesPath);

console.log('📁 Route files found:');
files.forEach(file => {
  console.log(`✅ ${file}`);
});

// Test importing routes
console.log('\n🔄 Testing route imports...');

async function testImports() {
  try {
    const authRoutes = await import('./src/routes/authRoutes.js');
    console.log('✅ authRoutes.js imported successfully');
    
    const userRoutes = await import('./src/routes/userRoutes.js');
    console.log('✅ userRoutes.js imported successfully');
    
    const nutritionRoutes = await import('./src/routes/nutritionRoutes.js');
    console.log('✅ nutritionRoutes.js imported successfully');
    
    const workoutRoutes = await import('./src/routes/workoutRoutes.js');
    console.log('✅ workoutRoutes.js imported successfully');
    
    const progressRoutes = await import('./src/routes/progressRoutes.js');
    console.log('✅ progressRoutes.js imported successfully');
    
    const analyticsRoutes = await import('./src/routes/analyticsRoutes.js');
    console.log('✅ analyticsRoutes.js imported successfully');
    
    const notificationRoutes = await import('./src/routes/notificationRoutes.js');
    console.log('✅ notificationRoutes.js imported successfully');
    
    const testRoutes = await import('./src/routes/testRoutes.js');
    console.log('✅ testRoutes.js imported successfully');
    
    console.log('\n🎉 All routes imported successfully!');
  } catch (error) {
    console.error('❌ Import error:', error.message);
    console.error('Full error:', error);
  }
}

testImports();