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
            try {
                await interaction.reply({ content: 'Erro ao executar ação.', ephemeral: true });
            } catch (error) {
                await interaction.editReply({ content: 'Erro ao executar ação.', ephemeral: true });
            }
        }
    },
};
