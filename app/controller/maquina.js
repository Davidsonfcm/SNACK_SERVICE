module.exports.autenticar = function(application, req, res) {

	var payload = req.body;

	if(payload.numeroDeSerie && payload.cartao && payload.senha)
	{
		var numeroDeSerie = payload.numeroDeSerie;
		var cartao = { 
			numero: payload.cartao ,
			senha: payload.senha
		};

		var connection = application.dbConnection;
		var MaquinaDAO = new application.app.model.MaquinaDAO(connection);
		var CartaoDAO = new application.app.model.CartaoDAO(connection);

		MaquinaDAO.buscar(numeroDeSerie, function(maquina){

				//exibe erro caso exista
				application.metodosGlobais.mensagemDeErroDAO(maquina, res);

				if (maquina.contents !== undefined)
				{
					CartaoDAO.buscar(cartao, function(cartaoDB) {

						if (cartaoDB.contents !== undefined)
						{
							var isMatch = application.bCrypt.compareSync(cartao.senha, cartaoDB.contents.senha);

							if (isMatch) {

								var result = { 
									numeroDeSerie: maquina.contents.numeroDeSerie,
									cartao: cartao.numero,
									senha: cartao.senha
								};

								var token = application.jwtSimple.encode(result, application.parametrosGlobais.jwt.secretKey);

								res.json({
									token: token
								});
							} else {
								res.sendStatus(application.httpStatus.UNAUTHORIZED);
							}
							
						} else {
							res.sendStatus(application.httpStatus.UNAUTHORIZED);
						}
						
					});
				}
				else {
					res.sendStatus(application.httpStatus.UNAUTHORIZED);
				}

			});
	} 
}

module.exports.registrar = function(application, req, res) {

	var maquina = req.body;

	req.assert('numeroDeSerie', 'numeroDeSerie não pode ser vazio').notEmpty();
	req.assert('unidade', 'Unidade não pode ser vazio').notEmpty();

	var erros = req.validationErrors();

	if(erros){
		res.json(JSON.stringify(erros));
		return;
	}

	var connection = application.dbConnection; 
	var MaquinaDAO = new application.app.model.MaquinaDAO(connection);

	MaquinaDAO.buscar(numeroDeSerie, function(maquina) {

			//exibe erro caso exista
			application.metodosGlobais.mensagemDeErroDAO(cartaoDB, res);

			if (maquina.contents !== undefined)
			{
				res.json([{
					"location": "params", 
					"param": "NumeroDeSerie",
					"msg": "Maquina já está registrada" }]);

				return;
			}

			MaquinaDAO.registrar(maquina);
			res.sendStatus(application.httpStatus.OK);
		});

	
}
