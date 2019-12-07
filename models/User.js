module.exports = (sequelize, DataTypes) =>{
	sequelize.define('User', {
		username: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			unique: true
		},
		password: DataTypes.STRING
	})
}
