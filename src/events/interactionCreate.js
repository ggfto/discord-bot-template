const { EmbedColors, createEmbed } = require('../utils/embedUtils');

async function createEmbedInteraction({description, color, fields}) {
    return await createEmbed({
        title: 'Interação',
        description,
        color,
        fields
    });
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            if (interaction.isCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction);
                return;
            }
            if (interaction.isAutocomplete()) {
                if (interaction.commandName === 'perm') {
                    const command = client.commands.get(interaction.commandName);
                    if (!command) return;
                    await command.autocomplete(interaction);
                }
                return;
            }
        } catch (error) {
            console.error(`Erro ao executar o comando ${interaction.commandName}:`, error);
            const embed = await createEmbedInteraction({description: 'Ocorreu um erro ao executar o comando.', color: EmbedColors.DANGER, fields: [{ name: 'Erro', value: error.message }] });
            try {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                await interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        }
    },
};
