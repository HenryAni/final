import * as dotenv from 'dotenv';
import { google } from 'googleapis';
import * as http from 'http';
import { URL } from 'url';

// Cargar variables de entorno
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generar URL de autorización
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
  ]
});

console.log('1. Abre esta URL en tu navegador:');
console.log(authUrl);
console.log('\n2. Inicia sesión con tu cuenta de Google y autoriza la aplicación');
console.log('3. Serás redirigido a localhost:3000/auth/google/callback');

// Crear servidor temporal para recibir el código
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const code = url.searchParams.get('code');

    if (code) {
      // Obtener tokens
      const { tokens } = await oauth2Client.getToken(code);
      
      console.log('\n=== REFRESH TOKEN ===');
      console.log(tokens.refresh_token);
      console.log('==================');
      console.log('\nCopia este token y agrégalo a tu archivo .env como GOOGLE_REFRESH_TOKEN');

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>¡Autorización exitosa!</h1>
        <p>Puedes cerrar esta ventana y volver a la consola.</p>
      `);

      // Cerrar el servidor después de obtener el token
      setTimeout(() => process.exit(0), 1000);
    }
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error al procesar la autorización');
  }
});

server.listen(3000, () => {
  console.log('\nEsperando autorización...');
});