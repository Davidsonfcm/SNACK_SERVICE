module.exports = function(application){

	application.post('/api/maquina', function(req, res){
		application.app.controller.maquina.registrar(application, req, res);
	});
	

}


