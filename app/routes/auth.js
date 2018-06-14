module.exports = function(application) {

	application.post('/api/token', function(req, res){
		application.app.controller.maquina.autenticar(application, req, res);
	});

}