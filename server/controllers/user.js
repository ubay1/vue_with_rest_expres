const Role = require('../models/role');
const User = require('../models/users');

module.exports = {
	list(req, res){
		return User.findAll({
			include: [{
				model: Role,
				as: 'roles'
			}],
		})
		.then((roles) => res.status(200).send(roles))
		.catch((error) => res.status(400).send(error))
	}
}
