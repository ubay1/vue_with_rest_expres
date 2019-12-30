'use strict';
module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    jabatan: DataTypes.STRING
  }, {});
  role.associate = function(models) {
		// associations can be defined here
		role.hasOne(models.users,{
			foreignKey: 'roleId',
      as : 'users',
      onDelete: 'CASCADE',
		})
  };
  return role;
};
