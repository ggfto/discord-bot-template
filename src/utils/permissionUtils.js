const CommandRoles = require('../model/commandRoleModel');
const { PermissionsBitField } = require('discord.js');

async function hasPermission(interaction, commandName = 'apoiador') {
    try {
        // Verifica se o usuário tem a permissão de Administrador
        if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return true;
        }

        // Converte os IDs dos cargos do usuário para um Set
        const userRoleIds = new Set(interaction.member.roles.cache.map(role => role.id));

        // Obtém os IDs dos cargos permitidos para o comando
        const allowedRoles = await CommandRoles.findAll({ where: { commandName } });
        const allowedRoleIds = new Set(allowedRoles.map(role => role.roleId));

        // Verifica se o usuário possui algum dos cargos permitidos
        return [...allowedRoleIds].some(roleId => userRoleIds.has(roleId));
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        return false;
    }
}

module.exports = hasPermission
