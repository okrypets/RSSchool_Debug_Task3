const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 5433,
    dialect: 'postgres',
    logging: false
})

const models = {
    User: require('./models/user')(sequelize, Sequelize.DataTypes),
    Game: require('./models/game')(sequelize, Sequelize.DataTypes),
  };

  Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });

sequelize.authenticate().then(
    function success() {
        console.log("Connected to DB");
    },

    function fail(err) {
        console.log(`Error: ${err}`);
    }
)

module.exports = {models, sequelize};