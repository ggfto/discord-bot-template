const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping? Pong!'),

    async execute(interaction) {
        return interaction.reply({ content: 'Pong!' });
    },
};
