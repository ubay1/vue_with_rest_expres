// node Backend Server
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const express 	 = require('express');
const models 		 = require('./server/db/db');
const cors  	 	 = require('cors')
const mysql 	 	 = require('mysql');
const bcrypt 		 = require('bcryptjs');
const jwt 		 	 = require("jsonwebtoken");
const passport 	 	 = require("passport");
const LocalStrategy  = require('passport-local').Strategy;
const config 			 	= require('./config');
const middleware 	 	= require('./middleware');
const jwtDecode 		= require('jwt-decode');
const blacklist 		= require('express-jwt-blacklist');
const {sequelize}		= require('./server/models/index');

const app 		 	 	= express();
var salt 				= bcrypt.genSaltSync(10);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// Connect to the database
var conn = mysql.createConnection(models.mysql);

//connect to database
conn.connect((err) =>{
  if(err){
		console.log('ett error gajelas but is work');
	};
  console.log('Mysql Connected...');
});

// date now
var date = new Date();
var datee = date.toLocaleString();

// ====================================== API USER ====================================\\
		// register user
		app.post('/api/users/register',[
			check('username').not().isEmpty().withMessage('Username wajib diisi'),
			check('email').not().isEmpty().withMessage('Email wajib diisi'),
			check('password').not().isEmpty().withMessage('password wajib diisi'),
			], (req, res) => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(422).json({ errors: errors.array() });
				}

				var body = {
					username: req.body.username,
					email: req.body.email,
					passwordhash: bcrypt.hashSync(req.body.password, salt)
				};

				console.log(body.username, body.email, body.passwordhash);

				var cekemail = `SELECT * FROM users WHERE email = '${body.email}'`;
				let qr = conn.query(cekemail, (err, results) => {
					if (results.length > 0) {
						res.send({
							data:{
								message:'email sudah digunakan',
								statuscode:500,
								success:false,
							}
						});
					} else{
						let sql = `INSERT INTO users (username,email,password,created_at,updated_at) VALUES ('${body.username}','${body.email}','${body.passwordhash}','${datee}','${datee}')`;

						let query = conn.query(sql, (err, results) => {
							if (err) {
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
										message: "data berhasil disimpan",
										statuscode: 200,
										success: true,
									}
								});
							}
						});
					}
				});

		});

		// login with jwt
		app.post('/api/users/login', [
			check('email').not().isEmpty().withMessage('Email wajib diisi'),
			check('password').not().isEmpty().withMessage('password wajib diisi'),
			],(req,res) => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(422).json({ errors: errors.array() });
				}

				var email 	 = req.body.email;
				var password = req.body.password;

				var d = new Date();
				d.setDate(d.getDate() + 1);
				console.log(d.toLocaleString());

				var cekemail = `SELECT * FROM users WHERE email = '${email}'`;
				let qr = conn.query(cekemail, (err, results) => {
						if (results.length == 0) {
							console.log('email tidak terdaftar');
							res.json({
								data:{
									message: 'email tidak terdaftar',
									success: false
								}
							})
						} else{
							var passworddecrypt = bcrypt.compareSync(password, results[0].password);
							if (passworddecrypt) {
								let token = jwt.sign({email: email, username: results[0].username},
									config.secret,
									{ expiresIn: '1s'}
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
			let query = conn.query(sql, (err, results) => {
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
		app.get('/api/products',(req, res) => {
			let sql = "SELECT * FROM products";

			let query = conn.query(sql, (err, results) => {
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

		//tampilkan data product berdasarkan id
		app.get('/api/products/:id',(req, res) => {
			let sql = "SELECT * FROM products WHERE id="+req.params.id;
			let query = conn.query(sql, (err, results) => {
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

		//Tambahkan data product baru
		app.post('/api/products',[
				check('nama').not().isEmpty().withMessage('Nama wajib diisi'),
				check('price').not().isEmpty().withMessage('price wajib diisi'),
				],(req, res) => {

				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(422).json({ errors: errors.array() });
				}
				// let data = {nama: req.body.nama, total: req.body.total};
				var nama       = req.body.nama;
				var price      = req.body.price;

				console.log(nama, price, datee);

				let sql = `INSERT INTO products (nama,price,created_at,updated_at) VALUES ('${nama}','${price}','${datee}','${datee}')`;

				let query = conn.query(sql, (err, results) => {
					if (err) {
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
								message: "data berhasil disimpan",
								statuscode: 200,
								success: true,
							}
						});
					}
				});
		});

		//Edit data product berdasarkan id
		app.put('/api/products/:id',[
			check('nama').not().isEmpty().withMessage('Nama wajib diisi'),
			check('price').not().isEmpty().withMessage('price wajib diisi'),
			], (req, res) => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(422).json({ errors: errors.array() });
				}

				let sql = "SELECT * FROM products WHERE id="+req.params.id;
				let query = conn.query(sql, (err, results) => {
					if (results.length == 0) {
						res.send({
							message: "data tidak ditemukan",
							statuscode: 500,
							success: false,
						});
					} else{
						let sql = "UPDATE products SET nama='"+req.body.nama+"', price='"+req.body.price+"', updated_at='"+datee+"' WHERE id="+req.params.id;
						let query = conn.query(sql, (err, results) => {
							if (err) {
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
						});
					}
				});
		});

		//Delete data product berdasarkan id
		app.delete('/api/products/:id',(req, res) => {
			let sql = "SELECT * FROM products WHERE id="+req.params.id;
				let query = conn.query(sql, (err, results) => {
					if (results.length == 0) {
						res.send({
							data:{
								message: "data tidak ditemukan",
								statuscode: 500,
								success: false,
							}
						});
					} else{
						let sql = "DELETE FROM products WHERE id="+req.params.id+"";
						let query = conn.query(sql, (err, results) => {
							if (err) {
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
						});
					}
				});
		});
// ======================================== END API PRODUCT ================================\\

// Monitor port
sequelize.sync()
.then(()=>{
	app.listen(3000);
	console.log('success listen at port:3000......');
})
