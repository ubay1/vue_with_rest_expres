// node Backend Server
// const models 		 = require('./server/db/db');
const { check, validationResult } = require('express-validator');
const bodyParser 	 = require('body-parser');
const express 	 	 = require('express');
const cors  	 	 = require('cors');
const queryDB 		 = require('./server/db/db');
const mysql 	 	 = require('mysql');
const {Pool, Client} = require('pg');
const bcrypt 		 = require('bcryptjs');
const jwt 		 	 = require("jsonwebtoken");
const passport 	 	 = require("passport");
const LocalStrategy  = require('passport-local').Strategy;
const config 			= require('./config');
const middleware 	 	= require('./middleware');
const jwtDecode 		= require('jwt-decode');
const blacklist 		= require('express-jwt-blacklist');
const {sequelize}		= require('./server/models/index');
const userController 	= require('./server/controllers/index');

const app 		 	 	= express();
var salt 				= bcrypt.genSaltSync(10);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

const pool = new Pool ({
    host: "localhost",
    user: "postgres",
    password: "secret",
    port: 5432,
    database: "vue_sequelize"
  });

// Connect to the database mysql
// var conn = mysql.createConnection(models.mysql);

//connect to database mysql
// conn.connect((err) =>{
//   if(err){
	// 		console.log('ett error gajelas but is work');
// 	};
//   console.log('Mysql Connected...');
// });

// date now
var date = new Date();
var datee = date.toLocaleString();

// ==== test SEQUELIZE ====\\
	app.get('/api/userss', userController.getAllUser());  
// ==== end SEQUELIZE ====\\

// ====================================== API USER ====================================\\
		// register user
		app.post('/api/users/register',[
			check('username').not().isEmpty().withMessage('Username wajib diisi'),
			check('email').not().isEmpty().withMessage('Email wajib diisi'),
			check('password').not().isEmpty().withMessage('password wajib diisi'),
			], async (req, res) => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(422).json({ errors: errors.array() });
				}

				var body = {
					roleid:3,
					username: req.body.username,
					email: req.body.email,
					passwordhash: bcrypt.hashSync(req.body.password, salt),
					createdat : datee,
					updatedat : datee,
				};

				console.log(body);
				
				// var query = `SELECT * FROM users WHERE email = '${body.email}'`;
				var querycheckuser = await pool.query(`SELECT * FROM users WHERE email = '${body.email}'`);
					if (querycheckuser.rows.length > 0) {
						res.send({
							data:{
								message:'email sudah digunakan',
								statuscode:500,
								success:false,
							}
						});
					} else{
						var queryInsertuser = pool.query(`INSERT INTO users ("roleId", "username", "email", "password", "createdAt", "updatedAt") VALUES (${body.roleid},'${body.username}','${body.email}','${body.passwordhash}','${body.createdat}','${body.updatedat}')`);

						if (!queryInsertuser) {
							res.send({
								data:{
									message:'gagal menyimpan data',
									statuscode:500,
									success:false,
								}
							});
						} else{
							res.send({
								data:{
									message:'sukses menyimpan data',
									statuscode:200,
									success:true,
								}
							});

							console.log(querycheckuser.rows);
						}
					}
		});

		// login with jwt
		app.post('/api/users/login', [
			check('email').not().isEmpty().withMessage('Email wajib diisi'),
			check('password').not().isEmpty().withMessage('password wajib diisi'),
			], async (req,res) => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(422).json({ errors: errors.array() });
				}

				var email 	 = req.body.email;
				var password = req.body.password;

				var cekemail = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
				if (cekemail.rows.length == 0) {
					console.log('email tidak terdaftar');
					res.send({
						data:{
							message:'email tidak terdaftar',
							statuscode:500,
							success:false,
						}
					});
				} 
				// console.log(cekemail.rows[0].password)
				else{
					var passworddecrypt = bcrypt.compareSync(password, cekemail.rows[0].password);
					if (passworddecrypt) {
						let token = jwt.sign({email: email, username: cekemail.rows[0].username},
							config.secret,
							{ expiresIn: '1y'}
						);

						res.json({
							data:{
								success: true,
								message: 'Authentication successful!',
								token: token,
								user: {
									email
								}
							}
						});
					}else {
						res.json({
							data:{
								success: false,
								message: 'Login gagal, email atau password salah',
							}
						});
					}
				}
		});

		// get user id
		app.get('/api/users/cektoken',middleware.checkToken,(req, res) => {

			let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto
			if (token.startsWith('Bearer ')) {
				token = token.slice(7, token.length);
			}

			var decoded = jwtDecode(token);

			res.json({
				success: true,
				message: 'sukses menampilkan data user',
				decoded: decoded
			});
		});

		// logout
		app.post('/api/users/logout',(req, res)=>{
			res.json({
				message:'sukses logout',
				success:true
			})
		})

		// get user id
		app.get('/api/users/:id',(req, res) => {
			let sql = "SELECT * FROM users WHERE id="+req.params.id;
			let query = queryDB.query(sql, (err, results) => {
				if (results.length == 0) {
					res.send({
						message: "data tidak ditemukan",
						statuscode: 500,
						success: false,
					});
				} else{
					res.send({
						message: "sukses menampilkan data",
						statuscode: 200,
						success: true,
						data: results
					})
				}
			});
		});
// ======================================== END API USER ==============================\\

// ======================================== API PRODUCT ================================\\
		//tampilkan semua data product
		app.get('/api/products', async (req, res) => {
			let sql = await pool.query("SELECT * FROM products");

				if (sql.rows.length == 0) {
					res.send({
						message: "data tidak ditemukan",
						statuscode: 500,
						success: false,
					});
				} else{
					res.send({
						message: "sukses menampilkan data",
						statuscode: 200,
						success: true,
						data: sql.rows
					})
				}
		});

		//tampilkan data product berdasarkan id
		app.get('/api/products/:id', async (req, res) => {
			let sql = await pool.query(`SELECT * FROM products WHERE id="${req.params.id}"`);

				if (sql.rows.length == 0) {
					res.send({
						message: "data tidak ditemukan",
						statuscode: 500,
						success: false,
					});
				} else{
					res.send({
						message: "sukses menampilkan data",
						statuscode: 200,
						success: true,
						data: sql.rows
					})
				}
		});

		//Tambahkan data product baru
		app.post('/api/products',[
				check('nama').not().isEmpty().withMessage('Nama wajib diisi'),
				check('price').not().isEmpty().withMessage('price wajib diisi'),
				], async (req, res) => {

				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(422).json({ errors: errors.array() });
				}
				// let data = {nama: req.body.nama, total: req.body.total};
				var nama       = req.body.nama;
				var price      = req.body.price;

				console.log(nama, price, datee);

				let sql = await pool.query(`INSERT INTO products ("nama","price","createdAt","updatedAt") VALUES ('${nama}','${price}','${datee}','${datee}')`);

				if (!sql) {
					res.send({
						data: {
							message: "data gagal disimpan",
							statuscode: 500,
							success: false,
						}
					});
				} else{
					res.send({
						data:{
							message: "data berhasil disimpan",
							statuscode: 200,
							success: true,
						}
					})
				}
		});

		//Edit data product berdasarkan id
		app.put('/api/products/:id',[
			check('nama').not().isEmpty().withMessage('Nama wajib diisi'),
			check('price').not().isEmpty().withMessage('price wajib diisi'),
			], async (req, res) => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(422).json({ errors: errors.array() });
				}

				let sql = await pool.query(`SELECT * FROM products WHERE id = ${req.params.id}`);
				if (sql.rows.length == 0) {
					res.send({
						message: "data tidak ditemukan",
						statuscode: 500,
						success: false,
					});
				} else{
					let sql = pool.query(`UPDATE products SET "nama"='${req.body.nama}', "price"='${req.body.price}', "updatedAt"='${datee}' WHERE id = ${req.params.id}`);
					if (!sql) {
						res.send({
							message:'ada yang error',
							statuscode:500,
							success:false,
							error: err
						});
					} else{
						res.send({
							message: "data berhasil diupdate",
							statuscode: 200,
							success: true,
						});
					}
				}
		});

		//Delete data product berdasarkan id
		app.delete('/api/products/:id', async (req, res) => {
			let sql = await pool.query(`SELECT * FROM products WHERE id = ${req.params.id}`);
			if (sql.rows.length == 0) {
				res.send({
					data:{
						message: "data tidak ditemukan",
						statuscode: 500,
						success: false,
					}
				});
			} else{
				let sql = pool.query(`DELETE FROM products WHERE id = ${req.params.id}`);
				if (!sql) {
					res.send({
						data:{
							message:'ada yang error',
							statuscode:500,
							success:false,
							error: err
						}
					});
				} else{
					res.send({
						data:{
							message: "data berhasil dihapus",
							statuscode: 200,
							success: true,
						}
					});
				}
			}
		});
// ======================================== END API PRODUCT ================================\\

// Monitor port
sequelize.sync()
.then(()=>{
	app.listen(3000);
	console.log('success listen at port:3000......');
})
