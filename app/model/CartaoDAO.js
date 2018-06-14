function CartaoDAO(connection) {
	this._connection = connection();
}

CartaoDAO.prototype.registrar = function(app, cartao) {

	var date = new Date();
	var dateUtc = app.moment().utc(date, "YYYY-MM-DD HH:mm:ss");

	cartao.senha = app.bCrypt.hashSync(cartao.senha, 10);
	cartao.data_registro = dateUtc.toDate();
	cartao.saldo = parseFloat(5.50);
	cartao.ultimaRecarga = dateUtc.toDate();
	cartao.expiracao = dateUtc.add(5,'Y').toDate();
	
	return this._connection.then(function(database){
		database.collection('cartoes', function(err, cartoes){

			if (err){
				callback({ error: true, contents: err.message } );
			}else{
				cartoes.insert(cartao);
				callback({ error: false, contents: "Ok" });
			}

		});
	});
};

CartaoDAO.prototype.buscar = function(cartao, callback) {

	return this._connection.then(function(database){
		database.collection('cartoes', function(err, cartoes){
			cartoes.find({numero: { $eq: cartao.numero }}).toArray(function(err, result){

				if (err){
					callback({ error: true, contents: err.message } );
				}else{
					callback({ error: false, contents: result[0] });
				}

			});
		});
	});
};

CartaoDAO.prototype.atualizarSaldo = function(saldo, cartao, callback) {

	return this._connection.then(function(database){
		database.collection('cartoes', function(err, cartoes){
			cartoes.update({ numero: cartao.numero }, { $set : { saldo: parseFloat(saldo) }}, function(err, result){

				if (err) {
					callback({error: true, contents: err.message });
				}
				else {
					callback({error: false, contents: "Saldo: " +  parseFloat(saldo) });
				}

			});
		});
	});

};


CartaoDAO.prototype.checarSaldo = function(compra, cartao, callback) {
	
	this.buscar(cartao, function(retorno){

		var cartao = retorno.contents;

		if(cartao !== undefined && !retorno.error)
		{
			var saldo = cartao.saldo - compra.valor;

			if (saldo < 0){
				callback({ error: true, contents: "Saldo insuficiente" });
			}else{
				callback({ error: false, contents: parseFloat(saldo)});
			}
		}
		else
		{
			callback({ error: true, contents: retorno.contents});
		}

	});
};


CartaoDAO.prototype.recarregar = function(app, cartao, callback) {

	var date = new Date();
	var dateUtc = app.moment(date).utc().toDate();

	return this._connection.then(function(database){
		database.collection('cartoes', function(err, cartoes){
			cartoes.update({ numero: cartao.numero }, { $set : { ultimaRecarga: dateUtc, saldo: parseFloat(5.50) }}, function(err, result){

				if (err) {
					callback({error: true, contents: err.message });
				}
				else {
					callback({error: false, contents: result });
				}

			});
		});
	});

};

CartaoDAO.prototype.checarRecarga = function(app, cartao, callback) {


	this.buscar(cartao, function(retorno){

		var date = new Date();
		var dateUtc = app.moment(date).utc();
		var cartao = retorno.contents;

		if(cartao !== undefined && !retorno.error)
		{
			var ultimaRecarga = app.moment(cartao.ultimaRecarga).utc();
			var dataAtual = dateUtc.toDate();
			var diffDate = ultimaRecarga.diff(dataAtual, 'days');

			callback({ error: false, contents: diffDate });
		}
		else
		{
			callback({error: true, contents: "Cartão não encontrado" });
		}

	});

	
};



module.exports = function() {
	return CartaoDAO;
}