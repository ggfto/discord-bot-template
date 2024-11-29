const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedColors, createEmbed } = require('../utils/embedUtils');
const hasPermission = require('../utils/permissionUtils');

async function createSayEmbed({description, color, fields}) {
    return createEmbed({
        title: 'Comando de Mensagens',
        description,
        color,
        fields,
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Envia uma mensagem para o canal atual ou para um canal específico.')
        .addStringOption(option =>
            option
                .setName('mensagem')
                .setDescription('Qual mensagem o bot irá enviar? (obrigatório)')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName('canal')
                .setDescription('Qual o canal onde a mensagem será enviada? (opcional)')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Verificação de permissão
        if (!await hasPermission(interaction, 'say')) {
            const embed = await createSayEmbed({description: 'Você não tem permissão para usar este comando.', color: EmbedColors.DANGER});
            return interaction.editReply({ embeds: [embed] });
        }

        const mensagem = interaction.options.getString('mensagem');
        const canalDestino = interaction.options.getChannel('canal') || interaction.channel;

        try {
            // Verifica se o canal selecionado é válido para mensagens de texto
            if (!canalDestino.isTextBased()) {
                const embed = await createSayEmbed({description: 'Por favor, selecione um canal de texto válido.', color: EmbedColors.WARNING});
                return interaction.editReply({ embeds: [embed] });
            }

            // Envia a mensagem para o canal especificado
            await canalDestino.send(mensagem);

            const embed = await createSayEmbed({description: `Mensagem enviada com sucesso para ${canalDestino}.`, color: EmbedColors.SUCCESS});
            return interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);

            const embed = await createSayEmbed({description: 'Ocorreu um erro ao enviar a mensagem.', color: EmbedColors.DANGER, fields: [{name: 'Mensagem de erro', value: error.message || 'Não foi possível identificar o erro.'}]});
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
