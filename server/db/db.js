// module.exports = {
// 	mysql: {
// 			host: 'localhost',
// 			user: 'root',
// 			password: null,
// 			database:'vue_sequelize'
// 	}
// }

const {Pool, Client}  = require('pg');

// linux
const pool = new Pool ({
    user: "postgres",
    password: "secret",
    host: "postgres",
    port: 5432,
    database: "vue_sequelize"
});

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}