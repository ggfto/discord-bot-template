require('dotenv').config();
const { Sequelize } = require('sequelize');

// Verificação das variáveis de ambiente necessárias
const requiredEnvVars = ['DB_DIALECT'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`A variável de ambiente ${varName} não está definida.`);
        process.exit(1);
    }
});

// Configuração do banco de dados com base no DB_DIALECT
const dbConfig = {
    dialect: process.env.DB_DIALECT, // Define o dialeto (mysql, sqlite, etc.)
    logging: process.env.DEBUG_MODE === 'true', // Habilita ou desabilita logging
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

// Configurações específicas para SQLite
if (process.env.DB_DIALECT === 'sqlite') {
    if (!process.env.DB_STORAGE) {
        console.error(`A variável de ambiente DB_STORAGE (caminho do arquivo SQLite) não está definida.`);
        process.exit(1);
    }
    dbConfig.storage = process.env.DB_STORAGE; // Caminho do arquivo SQLite
} else {
    // Configurações para outros bancos de dados (MySQL, PostgreSQL, etc.)
    const additionalEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
    additionalEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            console.error(`A variável de ambiente ${varName} não está definida.`);
            process.exit(1);
        }
    });

    Object.assign(dbConfig, {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    });
}

// Inicializa a conexão Sequelize
const sequelize = new Sequelize(dbConfig);

// Exporta a instância do Sequelize
module.exports = sequelize;
