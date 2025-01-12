const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

async function syncCommands(commands) {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Sincronizando comandos...');

        const targetRoute = process.env.DEBUG_MODE
            ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
            : Routes.applicationCommands(process.env.CLIENT_ID);

        await rest.put(targetRoute, { body: commands });
        console.log(process.env.DEBUG_MODE ? 'Comandos registrados localmente para debug.' : 'Comandos registrados globalmente.');
    } catch (error) {
        console.error('Erro ao sincronizar comandos:', error);
    }
}

module.exports = { syncCommands };
