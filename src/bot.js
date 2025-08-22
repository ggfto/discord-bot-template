const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, loadEvents } = require('./utils/loaders');
const { syncCommands } = require('./utils/commandSync');
const { handleError } = require('./utils/errorHandler');
require('dotenv').config();

const { DISCORD_TOKEN } = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

(async () => {
    try {
        // Carregar comandos e eventos
        console.log('Carregando comandos...');
        const commands = await loadCommands(client);
        console.log('Comandos carregados.');

        console.log('Carregando eventos...');
        await loadEvents(client);
        console.log('Eventos carregados.');

        // Sincronizar comandos
        await syncCommands(commands);

        // Inicializar o bot
        client.once('ready', async () => {
            console.log(`Bot iniciado como ${client.user.tag}`);
        });

        client.login(DISCORD_TOKEN);
    } catch (error) {
        handleError('Erro na inicialização do bot', error);
    }
})();
