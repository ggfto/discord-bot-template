const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './mydb.sqlite'
});

module.exports = sequelize;
