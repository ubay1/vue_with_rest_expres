// {

// 	"development": {
// 			"username": "root",
// 			"password": null,
// 			"database": "sequilez_db",
// 			"host": "localhost",
// 			"dialect": "mysql"

// 	},

// 	"test": {
// 			"username": "",
// 			"password": null,
// 			"database": "",
// 			"host": "",
// 			"dialect": "mysql"

// 	},

// 	"production": {
// 			"username": "",
// 			"password": null,
// 			"database": "",
// 			"host": "localhost",
// 			"dialect": "mysql"
// 	}

// }

module.exports = {
	db: {
		database : process.env.DB_NAME || 'sequilez_db',
		username: process.env.DB_USER || 'root',
		password: process.env.DB_PASS || '',
		options:{
			dialect : process.env.DIALECT || 'mysql',
			host : process.env.HOST || '127.0.0.1',
		}
	}
}
