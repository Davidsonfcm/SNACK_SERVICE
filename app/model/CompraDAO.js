function CompraDAO(connection) {
	this._connection = connection();
}


CompraDAO.prototype.registrar = function(app, compra, cartao, callback) {

	var date = new Date();
	var dateUtc = app.moment(date).utc().toDate();

	compra.numeroCartao = cartao.numero;
	compra.data = dateUtc;

	this._connection.then(function(connection) {
		connection.collection('compras', function(err, collection){

			if (err){
				callback({ error: true, contents: err.message } );
			}else{
				collection.insert(compra);
				callback({ error: false, contents: "Ok" });
			}
		
		});	
	});

};

module.exports = function() {
	return CompraDAO;
}