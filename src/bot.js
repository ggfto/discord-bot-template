const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config(); // Loads environment variables from the .env file

// Loads the bot token from the environment variables
const token = process.env.DISCORD_TOKEN;

// Creates a new Discord client instance with the required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,          // Intent to access guild data
        GatewayIntentBits.GuildPresences,  // Intent to monitor member presence (such as activities and games)
        GatewayIntentBits.GuildMembers     // Intent to access member information (necessary for changing nicknames and roles)
    ]
});

// Loads the presence update event handler
const handlePresenceUpdate = require('./events/presenceUpdate');

/**
 * 'ready' event triggered when the bot is logged in and ready.
 * It logs a message to the console when the bot has successfully logged in.
 */
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Registers the 'presenceUpdate' event handler
// This event is triggered when a member's presence status (activities, game, etc.) changes
client.on('presenceUpdate', handlePresenceUpdate);

// Logs the bot in using the provided token
client.login(token);
