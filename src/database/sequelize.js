require('dotenv').config();
const Sequelize = require('sequelize');
// let sequelize;
// if (process.env.DB_DIALECT === 'sqlite') {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './mydb.sqlite',
    });
// } else if (process.env.DB_DIALECT === 'mysql') {
//     sequelize = new Sequelize(
//         process.env.DB_NAME,
//         process.env.DB_USER,
//         process.env.DB_PASSWORD,
//         {
//             host: process.env.DB_HOST,
//             port: process.env.DB_PORT,
//             dialect: process.env.DB_DIALECT,
//             logging: process.env.DEBUG_MODE === 'true',
//         }
//     );
// }

module.exports = sequelize;
