"use strict";

var fs 				= require("fs");
var path 			= require("path");
var Sequelize = require("sequelize");
var env 	 		= process.env.NODE_ENV || "development";
var config 		= require('../config')
var db 				= {};
var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options);


fs
.readdirSync(__dirname)
.filter(function(file) {
		file !== "index.js";
})
.forEach(function(file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
