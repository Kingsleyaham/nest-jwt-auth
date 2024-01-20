const PORT = parseInt(process.env.PORT!, 10) || 5000;
const HOST = process.env.HOST || 'localhost';
const API_BASE_URI = process.env.API_BASE_URI!;

export default { PORT, HOST, API_BASE_URI };
