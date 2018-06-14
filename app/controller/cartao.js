module.exports.registrar = function(application, req, res) {

	var cartao = req.body;

	req.assert('nome', 'Nome não pode ser vazio').notEmpty();
	req.assert('cargo', 'Cargo não pode ser vazio').notEmpty();
	req.assert('unidade', 'Unidade não pode ser vazio').notEmpty();
	req.assert('senha', 'Senha não pode ser vazio').notEmpty();
	req.assert('numero', 'Número do Cartão não pode ser vazio').notEmpty();

	var erros = req.validationErrors();

	if(erros){
		res.json(JSON.stringify(erros));
		return;
	}

	var connection = application.dbConnection; 
	var CartaoDAO = new application.app.model.CartaoDAO(connection);

	CartaoDAO.buscar(cartao, function(resposta){

		if(resposta.contents !== undefined)
		{
			res.json([{
				"location": "params", 
				"param": "cartao",
				"msg": "Cartão já está registrado" }]);

			return;
		}

		CartaoDAO.registrar(application, cartao);

		res.sendStatus(application.httpStatus.OK);
	});

}
