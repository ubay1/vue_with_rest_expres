const Role = require('../models/role');
const User = require('../models/users');

const getAllUser = (req, res) => {
      User.users.find()
      .then( getusers => { 
          console.log(getusers) 
          return res.status(200).json({ getusers });
       })
      .catch (error => {
        return res.status(500).send(error.message);
      });
};

module.exports = {
    getAllUser
}