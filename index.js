require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error('DISCORD_TOKEN non è definito nel file .env');
}

const commands = [
    {
        data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Risponde con Pong!'),
        execute: async (interaction) => interaction.reply('Pong!'),
    },
    {
        data: new SlashCommandBuilder()
            .setName('dashboard')
            .setDescription('Fornisce il link alla dashboard del bot.'),
        execute: async (interaction) => {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Dashboard del Bot')
                .setDescription('Puoi accedere alla dashboard del bot cliccando sul link qui sotto.')
                .addFields({ name: 'Stato', value: 'In sviluppo' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('chatbot_ai')
            .setDescription('AI Sul Bot Discord'),
        execute: async (interaction) => {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Chatbot AI')
                .setDescription('Usa Il Bot AI Per Usare l\'AI\nNome Bot: Di AI (ChatBot)')
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('shop')
            .setDescription('Shop (Soldi Virtuali)'),
        execute: async (interaction) => {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Shop')
                .setDescription('Lo Shop e i soldi virtuali sono in arrivo (soldi tramite /balance e shop con /shop)')
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
    }
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(token);

async function registerCommands(applicationId) {
    const applicationCommandsRoute = Routes.applicationCommands(applicationId);
    const existingCommands = await rest.get(applicationCommandsRoute);

    for (const command of commands) {
        const commandData = command.data.toJSON();
        const existingCommand = existingCommands.find(
            (registeredCommand) => (
                registeredCommand.name === commandData.name
                && registeredCommand.type === commandData.type
            ),
        );

        if (existingCommand) {
            await rest.patch(
                Routes.applicationCommand(applicationId, existingCommand.id),
                { body: commandData },
            );
        } else {
            await rest.post(applicationCommandsRoute, { body: commandData });
        }
    }
}

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
        await registerCommands(client.user.id);
        console.log('Comandi slash registrati globalmente.');
    } catch (error) {
        console.error('Registrazione dei comandi fallita:', error.message);
        process.exitCode = 1;
        await client.destroy();
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find((item) => item.data.name === interaction.commandName);
    if (command) {
        await command.execute(interaction);
    }
});

if (require.main === module) {
    client.login(token).catch((error) => {
        console.error('Avvio del bot fallito:', error.message);
        process.exitCode = 1;
    });
}

module.exports = { registerCommands };
