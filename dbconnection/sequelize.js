// Include Sequelize module
const Sequelize = require('sequelize')

// Creating new Object of Sequelize
const sequelize = new Sequelize(
	'plivousersdata',
	'DATABASE_USER_NAME',
	'DATABASE_PASSWORD', {

		// Explicitly specifying
		// mysql database
		dialect: 'mysql',

		// By default host is 'localhost'		
		host: 'localhost'
	}
);

// Exporting the sequelize object.
// We can use it in another file
// for creating models
module.exports = sequelize
