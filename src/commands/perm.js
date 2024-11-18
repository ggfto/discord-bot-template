const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { EmbedColors, createEmbed } = require('../utils/embedUtils');
const { ActionType } = require('../utils/constants');
const CommandRoles = require('../model/commandRoleModel');
const hasPermission = require('../utils/permissionUtils');

async function getPermissionsDescription(commandName) {
    const roles = await CommandRoles.findAll({ where: { commandName } });
    return roles.length > 0
        ? roles.map(role => `• <@&${role.roleId}>`).join('\n')
        : 'Nenhuma permissão configurada.';
}

async function createPermissionEmbed(action, commandName, roleId = null, details = '', color) {
    const permissionsDescription = await getPermissionsDescription(commandName);

    const fields = [];

    if (commandName) {
        fields.push(
            { name: 'Comando', value: `\`${commandName}\``, inline: true },
        );
        if (roleId) {
            fields.push(
                { name: 'Cargo', value: `<@&${roleId}>`, inline: true },
            );
        }
    }

    if (action !== ActionType.LIST) {
        fields.push({ name: 'Detalhes', value: details });
    }

    if (action !== ActionType.ERROR) {
        fields.push({ name: 'Cargos Permitidos', value: permissionsDescription });
    } else {
        color = EmbedColors.DANGER;
    }

    return createEmbed({
        title: 'Gerenciamento de Permissões',
        description: `Resultado da operação: **${action}**`,
        color,
        fields
    });
}

async function handleAddPermission(commandName, role, guildId) {
    const existingRole = await CommandRoles.findOne({ where: { commandName, roleId: role.id } });

    if (existingRole) {
        return createPermissionEmbed(ActionType.ADD, commandName, role.id, 'Cargo ja possui permissão para o comando.', EmbedColors.INFO);
    }

    await CommandRoles.create({ commandName, roleId: role.id, guildId });
    return createPermissionEmbed(ActionType.ADD, commandName, role.id, 'Sucesso na operação.', EmbedColors.SUCCESS);
}

async function handleRemovePermission(commandName, role) {
    const existingRole = await CommandRoles.findOne({ where: { commandName, roleId: role.id } });

    if (!existingRole) {
        return createPermissionEmbed(ActionType.REMOVE, commandName, role.id, 'Cargo não possui permissão para o comando.', EmbedColors.INFO);
    }

    await existingRole.destroy();
    return createPermissionEmbed(ActionType.REMOVE, commandName, role.id, 'Permissão removida com sucesso.', EmbedColors.SUCCESS);
}

async function handleListPermissions(commandName) {
    return createPermissionEmbed(ActionType.LIST, null, null, '', EmbedColors.INFO);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perm')
        .setDescription('Gerencia cargos permitidos para um comando')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Adiciona um cargo permitido para um comando')
                .addStringOption(option =>
                    option.setName('comando')
                        .setDescription('Nome do comando')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addRoleOption(option =>
                    option.setName('cargo')
                        .setDescription('Cargo a ser adicionado')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Remove um cargo permitido de um comando')
                .addStringOption(option =>
                    option.setName('comando')
                        .setDescription('Nome do comando')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addRoleOption(option =>
                    option.setName('cargo')
                        .setDescription('Cargo a ser removido')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('list')
                .setDescription('Lista os cargos permitidos para um comando')
                .addStringOption(option =>
                    option.setName('comando')
                        .setDescription('Nome do comando')
                        .setRequired(true)
                        .setAutocomplete(true))),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!await hasPermission(interaction, 'perm')) {
            const embed = await createPermissionEmbed(ActionType.ERROR, null, null, 'Você não tem permissão para usar este comando.');
            return interaction.editReply({ embeds: [embed] });
        }

        const subcommand = interaction.options.getSubcommand();
        const commandName = interaction.options.getString('comando');
        const role = interaction.options.getRole('cargo');

        const handlers = {
            add: () => handleAddPermission(commandName, role, interaction.guild.id),
            remove: () => handleRemovePermission(commandName, role),
            list: () => handleListPermissions(commandName)
        };

        try {
            const embed = await handlers[subcommand]();
            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Erro ao processar o subcomando /perm ${subcommand}:`, error);
            const embed = await createPermissionEmbed(ActionType.ERROR, null, error.message, 'Ocorreu um erro ao processar o comando.');
            return interaction.editReply({ embeds: [embed] });
        }
    },

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === 'comando') {
            const commands = interaction.client.commands.map(cmd => cmd.data.name);
            const filteredCommands = commands
                .filter(cmd => cmd.toLowerCase().includes(focusedOption.value.toLowerCase()))
                .slice(0, 10);
            await interaction.respond(filteredCommands.length > 0
                ? filteredCommands.map(cmd => ({ name: cmd, value: cmd }))
                : [{ name: 'Nenhum comando encontrado', value: '' }]);
        }
    },
};
