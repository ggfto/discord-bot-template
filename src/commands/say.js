const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { colors } = require('../utils/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Envia uma mensagem para o canal atual ou para um canal especifico.')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('Qual mensagem o bot irá enviar? (obrigatório)')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Qual o canal onde a mensagem será enviada? (opcional)')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!await hasPermission(interaction, 'say')) {
            const embed = new EmbedBuilder()
                .setTitle('Comando de Mensagens')
                .setDescription('Você não tem permissão para usar este comando.')
                .setColor(colors.danger);
            return interaction.editReply({ embeds: [embed] });
        }

        const message = interaction.options.getString('mensagem');
        const targetChannel = interaction.options.getChannel('canal') || interaction.channel;

        await interaction.deferReply({ ephemeral: true });

        try {
            if (!targetChannel.isTextBased()) {
                const embed = new EmbedBuilder()
                    .setTitle('Comando de Mensagens')
                    .setDescription(`Por favor, selecione um canal de texto válido.`)
                    .setColor(colors.warning);
                return interaction.editReply({ embeds: [embed] });
            }

            await targetChannel.send(message);

            const embed = new EmbedBuilder()
                .setTitle('Comando de Mensagens')
                .setDescription(`Mensagem enviada para ${targetChannel}.`)
                .setColor(colors.success);
            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
            const embed = new EmbedBuilder()
                .setTitle('Comando de Mensagens')
                .setDescription(`Ocorreu um erro ao processar o comando.`)
                .setColor(colors.danger)
                .addFields(
                    { name: 'Mensagem de erro', value: error.message },
                );
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
