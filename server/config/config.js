// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_CONNECTION_STR;
}
process.env.DB_URL = urlDB;

// Vencimiento del token
// 30 días
process.env.CADUCIDAD_TOKEN = (60 * 60 * 24 * 30);

// Semilla para el token de autenticación
process.env.SEMILLA_TOKEN = process.env.SEMILLA_TOKEN || 'SECRET';

// Google client id
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '9087276834-a60tds5jo6e6cjk189tvo1c2c63h73p6.apps.googleusercontent.com';