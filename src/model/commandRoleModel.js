const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const CommandRoles = sequelize.define('commandRoles', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    commandName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

CommandRoles.sync();

module.exports = CommandRoles;
