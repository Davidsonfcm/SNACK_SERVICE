var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var httpStatus = require('http-status');
var jwtSimple = require('jwt-simple');
var bCrypt = require('bcrypt');
var moment = require('moment');
var globalParameters = require('./globalParameters');
var dbConnection = require('./dbConnection');
var authorization = require('./jwtAuth');

/* Instância do express */
var app = express();

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*middleware de validação de formulário*/
app.use(expressValidator());

/*Parametros globais de configuração*/
var parametrosGlobais = globalParameters(app);
app.parametrosGlobais = parametrosGlobais;


/*Conexao com o banco de dados*/
var conexao = dbConnection(app);
app.dbConnection = conexao;

/* Autenticação da maquina de snacks */
var auth = authorization(app);
app.use(auth.inicializar());
app.jwtAuth = auth;

/*Sessão para controle de login de usuarios para cadastro de maquinas e usuarios de maquina*/
app.use(expressSession({
	secret: parametrosGlobais.jwt.secretKey,
	resave: false,
	saveUninitialized: false
}));

/*Adicionar ferramenta de encriptação na aplicação*/
app.bCrypt = bCrypt;

/*biclioteca do jwt*/
app.jwtSimple = jwtSimple;

/*biclioteca do httpStatus*/
app.httpStatus = httpStatus;

/*biclioteca moment*/
app.moment = moment;

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/routes')
	.then('app/model')
	.then('app/controller')
	.into(app);

/* exportar o objeto app */
module.exports = app;