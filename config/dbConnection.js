var mongo = require('mongodb');

var conMongoDB = function() {

	return new Promise(function(resolve, reject) {

		mongo.MongoClient.connect(new mongo.Server("localhost", 27017), {native_parser: true})
		.then(
			function(database){
				var db = database.db("snackDB");

				console.log("Conectado com sucesso");
				resolve(db);
			},
	        function(err) {
	 			console.log("Error connecting: " + err.message);
	 			reject(err.message);
        	}
        );
	});
}

module.exports = function() {
	return conMongoDB;
}