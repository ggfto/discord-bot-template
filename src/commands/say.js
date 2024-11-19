const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { EmbedColors, createEmbed } = require('../utils/embedUtils');
const hasPermission = require('../utils/permissionUtils');

async function createSayEmbed(description, color, fields = []) {
    return await createEmbed({
        title: 'Comando de Mensagens',
        description,
        color,
        fields
    });
}

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
            const embed = await createSayEmbed('Você não tem permissão para usar este comando.', EmbedColors.DANGER);
            return interaction.editReply({ embeds: [embed] });
        }

        const message = interaction.options.getString('mensagem');
        const targetChannel = interaction.options.getChannel('canal') || interaction.channel;

        try {
            if (!targetChannel.isTextBased()) {
                console.error('Canal inválido:', targetChannel);
                const embed  = createSayEmbed('Por favor, selecione um canal de texto válido.', EmbedColors.WARNING);
                return interaction.editReply({ embeds: [embed] });
            }

            await targetChannel.send(message);

            const embed = await createSayEmbed(`Mensagem enviada para ${targetChannel}.`, EmbedColors.SUCCESS);
            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
            const fields = {
                name: 'Mensagem de erro',
                value: error.message,};
            const embed = await createSayEmbed('Ocorreu um erro ao enviar a mensagem.', EmbedColors.DANGER, fields);
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
