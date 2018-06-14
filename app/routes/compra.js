module.exports = function(application){

	application.post('/api/compra', application.jwtAuth.autenticarNaMaquina(), function(req, res){
		application.app.controller.compra.registrar(application, req, res);
	});

}