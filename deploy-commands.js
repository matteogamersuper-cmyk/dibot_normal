require('dotenv').config();

const { registerCommands } = require('./index');

const applicationId = process.env.DISCORD_CLIENT_ID;

if (!applicationId) {
    throw new Error('DISCORD_CLIENT_ID non è definito nel file .env');
}

registerCommands(applicationId).then(() => {
    console.log('Comandi slash registrati globalmente.');
}).catch((error) => {
    console.error('Registrazione dei comandi fallita:', error.message);
    process.exitCode = 1;
});
