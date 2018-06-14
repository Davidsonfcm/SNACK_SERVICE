function MaquinaDAO(connection) {
	this._connection = connection();
}

MaquinaDAO.prototype.buscar = function(numSerie, callback) {

	return this._connection.then(function(connection) {
		connection.collection('maquinas', function(err, collection){
			collection.find({numeroDeSerie: { $eq: numSerie }}).toArray(function(err, result){

				if (err){
					callback({ error: true, contents: err.message } );
				}else{
					callback({ error: false, contents: result[0] });
				}

			});
		});
		
	});

};


MaquinaDAO.prototype.registrar = function(maquina) {

	return this._connection.then(function(connection) {
		connection.collection('maquinas', function(err, collection){

			if (err){
				callback({ error: true, contents: err.message } );
			}else{
				collection.insert(maquina);
				callback({ error: false, contents: "Ok" });
			}
			
		});	
	});

};


module.exports = function() {
	return MaquinaDAO;
}