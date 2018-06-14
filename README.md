# Projeto SNACK_Service

Este é um projeto de um serviço com o intuito de auxiliar uma maquina de guloseimas nas suas vendas. 
Abaixo estão as especificações deste projeto.

### Regras

* Saldo expira diariamente;
* Saldo não cumulativo;
* Produtos custam 2 e 5,50;
* produto é retirado saldo é atualizado.

### Instalação 

Antes de iniciar a execução do serviço o servidor deve possuir mongoDB instalado, que é possivel ser feito atraves do link 
[MongoDB](https://www.mongodb.com/).

Ao efetuar o clone d aplicação deve ser feito a instalação de todas as dependencias do projeto com o comando a seguir na raiz da pasta do projeto.

```
npm install
```

### Estrutura de dados

Abaixo se encontra a estrutura de dados onde temos o registro da maquina de snack, registro dos cartões dos usuários e registro de compras.


```
maquinas = {
	NumeroDeSerie: GKSD212345687,
	Unidade: BH,
}

cartoes = {
	Usuario: Usuario Teste
	cargo: Gerente de TI,
	unidade: BH,
	data_registro: 01-01-2018
	senha: 12345 (criptografada)
	cartao: 1111222233334444,
	saldo: 5,50
	expiracao: 10-2018,
	ultimaRecarga: 01-01-2018
}

compras = {
	cartao: cartao,
	item: Biscoito,
	valor: 2.00,
	data: 01-01-2018
}


```

As entidades de cartões e maquinas são previamente cadastradas fazendo uso dos serviços a seguir:

* http://domain/api/cartao (POST)
* http://domain/api/maquina (POST)

## Autenticação

A autenticação usada foi a [JWT](https://jwt.io/)(Json Web TOken) que consiste validar todas as requisições atraves de um token previamente criado.

O token é gerado com base no número de serie da máquina, no numero do cartão do usuário e na senha do usuário.

Abaixo temos a url e a assinatura esperada no post. 

* http://domain/api/token (POST)

```
payload  = {
	NumeroDeSerie: GKSD212345687,
	cartao: 1111222233334444,
	senha: 123456
}

```

Para efetuar a compra atráves da máquina e necessário que esse token gerado seja enviado no cabeçalho da requisições de compra. 

Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJudW1lcm9EZVNlcmllIjoiMTIzNDU2Iiw

* http://domain/api/compra (POST)

```
compra  = {
	produto: biscoito,
	valor: 2.00
}

```
