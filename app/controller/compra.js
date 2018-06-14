module.exports.registrar = function(application, req, res){

	var cartao = { numero: req.user.cartao };
	var compra = req.body;

	req.assert('produto', 'Produto não pode ser vazio').notEmpty();
	req.assert('valor', 'Valor não pode ser vazio').notEmpty();

	var erros = req.validationErrors();

	if(erros){
		res.json(JSON.stringify(erros));
		return;
	}

	var connection = application.dbConnection;
	var CartaoDAO = new application.app.model.CartaoDAO(connection);
	var CompraDAO = new application.app.model.CompraDAO(connection);

	CartaoDAO.checarRecarga(application, cartao, function(cRecarga){

		if (cRecarga.contents < 0)
		{
			CartaoDAO.recarregar(application, cartao, function(result){
				if(result.error){	
					res.json(result);
					return;				
				}
			});
		} 

		CartaoDAO.checarSaldo(compra, cartao, function(cSaldo){
			if(cSaldo.error){
				res.json(cSaldo);
				return;	
			} 
			else {
				
				CompraDAO.registrar(application, compra, cartao, function(cCompra){
					if(cCompra.error){
						res.json(cCompra);
						return;	
					}
					else {
						CartaoDAO.atualizarSaldo(cSaldo.contents, cartao, function(aSaldo){
							res.json(aSaldo);							
						});
					}
				});

			}
		});

	});

}
