#!/usr/bin/node

let http = require("http");
let fs = require("fs");

let mongo_client = require("mongodb").MongoClient;

let url = "mongodb://localhost/";

console.log("Iniciando script mongo-http");

let database;

mongo_client.connect(url, function(error, connection){

	console.log("Dentro de MongoDB.");
	console.log(error);

	if(error){
		console.log("ERROR!!!");
		return;
	}

	database = connection.db("tffhd");

});

http.createServer(function(request, response){
	response.writeHead(200);

	let saludo = "<h1>Muy buenos dias companero!</h1>";

	let array = [];

	let i = 0;

	let dataToSend;

	var peticion;

	peticion = request.url.substring(1);
	
	if(peticion == "index.html"){
		fs.readFile("index.html", function (err, data){
			response.writeHead(200, {"Content-Type" : "text/html"});
			response.end(data);
		})
		return;
	}

	if(peticion.length == 0){peticion = " ";}	
	let testing  = database.collection(peticion).find();
	testing.toArray(function(error,data){
		if(data.length != 0){
			dataToSend  = JSON.stringify(data);
			response.end(dataToSend);
			}
			else{
			response.end("DATA NOT FOUND");
			}
		})

}).listen(1095);
