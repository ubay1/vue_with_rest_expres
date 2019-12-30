'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
		roleId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT
  }, {});
  users.associate = function(models) {
		// associations can be defined here
    users.belongsTo(models.role, {
      foreignKey: 'roleId',
      as: 'author',
      onDelete: 'CASCADE',
    })
  };
  return users;
};
