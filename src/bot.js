const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID, DEBUG_MODE } = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
    ]
});

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

client.commands = new Collection();

// Carregar comandos
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Função para remover comandos
async function clearCommands() {
    try {
        console.log('Removendo todos os comandos registrados...');
        // Remover comandos da guilda
        const guildCommands = await rest.get(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID));
        for (const command of guildCommands) {
            await rest.delete(Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, command.id));
            console.log(`Comando da guilda removido: ${command.name}`);
        }

        // Remover comandos globais
        const globalCommands = await rest.get(Routes.applicationCommands(CLIENT_ID));
        for (const command of globalCommands) {
            await rest.delete(Routes.applicationCommand(CLIENT_ID, command.id));
            console.log(`Comando global removido: ${command.name}`);
        }

        console.log('Todos os comandos foram removidos com sucesso!');
    } catch (error) {
        handleError('Erro ao remover comandos', error);
    }
}

// Função para registrar comandos na guilda ou globalmente
async function registerCommands() {
    try {
        console.log('Registrando comandos...');
        const targetRoute = DEBUG_MODE
            ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
            : Routes.applicationCommands(CLIENT_ID);

        await rest.put(targetRoute, { body: commands });
        console.log(DEBUG_MODE ? 'Comandos registrados apenas na guilda para debug.' : 'Comandos registrados globalmente.');
    } catch (error) {
        handleError('Erro ao registrar comandos', error);
    }
}

// Função centralizada para sincronizar os comandos
async function syncCommands() {
    try {
        // Passo 1: Remover comandos antigos
        await clearCommands();

        // Passo 2: Registrar novos comandos
        await registerCommands();
    } catch (error) {
        handleError('Erro ao sincronizar comandos', error);
    }
}

// Função centralizada para tratamento de erros
function handleError(message, error) {
    console.error(message, error);
    // Caso necessário, podemos expandir para logar em arquivos, enviar alertas por email, Slack, etc.
}

// Carregar eventos
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Inicializar o bot
client.once('ready', () => {
    syncCommands();  // Sincroniza comandos ao inicializar
    console.log(`Bot iniciado como ${client.user.tag}`);
});

client.login(DISCORD_TOKEN);
