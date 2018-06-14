var passport = require('passport');
var passportjwt = require('passport-jwt');

module.exports = function(application) {

	var dbConnection = application.dbConnection(); 

	var opts = {};
	opts.secretOrKey =  application.parametrosGlobais.jwt.secretKey;
	opts.jwtFromRequest = passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken();

	var strategy = new passportjwt.Strategy(opts, (payload, done) => {

		dbConnection.then(function(database) {
			database.collection('maquinas', function(err, collection){
				collection.find({numeroDeSerie: { $eq: payload.numeroDeSerie }}).toArray(function(err, maquina){

					if(maquina[0] !== undefined)
					{
						database.collection('cartoes', function(err, cartoes){

							cartoes.find({numero: {$eq: payload.cartao}}).toArray(function(err, cartao){

								if(cartao[0] !== undefined)
								{
									var isMatch = application.bCrypt.compareSync(payload.senha, cartao[0].senha);	

									if(isMatch)
									{
										return done(null, {
											numeroDeSerie: payload.numeroDeSerie,
											cartao: payload.cartao,
											senha: payload.senha
										});
									}
									else
									{
										return done(null, false);
									}
									
								}
								else
								{
									return done(null, false);
								}
								
							});

						});
					}
					else 
					{
						return done(null, false);
					}
					
				});
			});

		});

	});

	passport.use(strategy);

	return {
		inicializar: function() {
			return passport.initialize();
		},
		autenticarNaMaquina: function() {
			return passport.authenticate("jwt", application.parametrosGlobais.jwt.session);
		}
	}
}