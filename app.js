/* importar as configurações do servidor */
var app = require('./config/server');

/* escutar na porta 80 */
app.listen(80, function(){
	console.log('Servidor snack_service online');
});