const { EmbedBuilder } = require('discord.js');

// Enum para cores padrão
const EmbedColors = {
    SUCCESS: 0x198754,
    WARNING: 0xffc107,
    INFO: 0x0dcaf0,
    DANGER: 0xdc3545,
    DEFAULT: 0xFFFFFF
};

/**
 * Cria um embed genérico.
 *
 * @param {string} title - Título do embed.
 * @param {string} description - Descrição do embed.
 * @param {string} color - Cor do embed (use EmbedColors).
 * @param {Array} fields - Campos adicionais (name, value, inline).
 * @returns {EmbedBuilder} O embed configurado.
 */
function createEmbed({ title, description = '', color = EmbedColors.DEFAULT, fields = [] }) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color);

    if (description) {
        embed.setDescription(description);
    }

    if (fields.length > 0) {
        embed.addFields(fields);
    }

    return embed;
}

module.exports = {
    EmbedColors,
    createEmbed
};
