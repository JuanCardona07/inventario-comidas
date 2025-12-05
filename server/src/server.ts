import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { emailAlertService } from './services/emailAlertService';

// Cargar variables de entorno
process.env.DOTENV_CONFIG_SILENT = 'true';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check (antes de MongoDB)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' });
});

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/inventario_comidas';

console.log('')
console.log('🔄 Intentando conectar a MongoDB...');

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');

    // Inicializar servicio de alertas por email
    emailAlertService.initialize({
      emailService: process.env.EMAIL_SERVICE || 'gmail',
      emailUser: process.env.EMAIL_USER || '',
      emailPass: process.env.EMAIL_PASS || '',
      emailTo: process.env.EMAIL_TO || '',
      threshold: parseInt(process.env.ALERT_THRESHOLD || '3'),
    });

    // Importar rutas
    const ingredientesRoutes = await import('./routes/ingredientes');
    const recetasRoutes = await import('./routes/recetas');
    const ordenesRoutes = await import('./routes/ordenes');
    const alertsRoutes = await import('./routes/alerts');

    // Configurar rutas
    app.use('/api/ingredientes', ingredientesRoutes.default);
    app.use('/api/recetas', recetasRoutes.default);
    app.use('/api/ordenes', ordenesRoutes.default);
    app.use('/api/alerts', alertsRoutes.default);

    app.use(notFoundHandler);
    app.use(errorHandler);

    // Iniciar servidor
    app.listen(PORT, () => {
      const fechaInicio = new Date().toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🕐 Fecha y hora de inicio: ${fechaInicio}`);
    });
  } catch (err: any) {
    console.error('');
    console.error('❌ ERROR AL INICIAR EL SERVIDOR:');
    console.error('📄 Detalles:', err.message);
    console.error('');

    if (err.message.includes('ECONNREFUSED')) {
      console.error('💡 MongoDB no está corriendo. Inícialo con:');
      console.error('   Windows: net start MongoDB');
      console.error('   Mac: brew services start mongodb-community');
      console.error('   Linux: sudo systemctl start mongod');
    }

    console.error('');
    process.exit(1);
  }
}

// Manejar errores no capturados
process.on('unhandledRejection', (err: any) => {
  console.error('❌ Error no manejado:', err.message);
});

process.on('uncaughtException', (err: any) => {
  console.error('❌ Excepción no capturada:', err.message);
  process.exit(1);
});

// Iniciar servidor
startServer();

export default app;
