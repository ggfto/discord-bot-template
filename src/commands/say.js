const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Envia uma mensagem usando o bot.')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('O que o bot deve dizer')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('O canal onde a mensagem será enviada')
                .setRequired(false)),

    async execute(interaction) {
        const message = interaction.options.getString('mensagem');
        const targetChannel = interaction.options.getChannel('canal') || interaction.channel;
        const member = interaction.member;

        if (!member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            if (!targetChannel.isTextBased()) {
                return interaction.editReply({ content: 'Por favor, selecione um canal de texto válido.', ephemeral: true });
            }

            await targetChannel.send(message);

            await interaction.editReply({ content: `Mensagem enviada para ${targetChannel}.`, ephemeral: true });
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
            await interaction.editReply({ content: 'Ocorreu um erro ao enviar a mensagem.', ephemeral: true });
        }
    },
};
