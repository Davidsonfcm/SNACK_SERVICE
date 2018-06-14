module.exports = function(application){

	application.post('/api/cartao', function(req, res){
		application.app.controller.cartao.registrar(application, req, res);
	});

}