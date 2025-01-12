const fs = require('fs');
const path = require('path');

async function loadCommands(client, commandsPath = './src/commands') {
    const commands = [];

    function readFiles(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.resolve(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                readFiles(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
            }
        }
    }

    readFiles(commandsPath);
    return commands;
}

async function loadEvents(client, eventsPath = './src/events') {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(path.resolve(eventsPath, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    console.log(`Eventos registrados: ${eventFiles.length}`);
}

module.exports = { loadCommands, loadEvents };