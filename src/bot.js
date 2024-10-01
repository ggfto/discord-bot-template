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

client.commands = new Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Erro ao executar o comando:', error);
        await interaction.reply({ content: 'Houve um erro ao executar esse comando.', ephemeral: true });
    }
});

async function syncCommands() {
    try {
        console.log('Sincronizando os comandos de slash...');

        const registeredCommands = await rest.get(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID));
        const definedCommandNames = Array.from(client.commands.keys());
        const commandsToRemove = registeredCommands.filter(cmd => !definedCommandNames.includes(cmd.name));

        for (const command of commandsToRemove) {
            await rest.delete(Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, command.id));
            console.log(`Comando removido: ${command.name}`);
        }

        if (DEBUG_MODE) await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('Comandos sincronizados com sucesso!');

    } catch (error) {
        console.error('Erro ao sincronizar comandos de slash:', error);
    }
}

client.once('ready', () => {
    syncCommands();
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(DISCORD_TOKEN);
