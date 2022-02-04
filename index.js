#!/usr/bin/node

let http = require("http");

let mongo_client = require("mongodb").MongoClient;

let url = "mongodb://localhost/";

console.log("Iniciando script mongo-http");

mongo_client.connect(url, function(error, connection){

	console.log("Dentro de MongoDB.");
	console.log(error);
	
	if(error){
		console.log("ERROR!!!");
		return;
	}

	let database = connection.db("tffhd");

	let characters  = database.collection("characters").find();

	console.log(characters);

});

/*
http.createServer(function(request, response){
	response.writeHead(200);

	let saludo = "<h1>Muy buenos dias companero!</h1>";

	response.end(saludo);

}).listen(1095);
*/


