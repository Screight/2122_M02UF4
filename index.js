#!/usr/bin/node

let http = require("http");
let fs = require("fs");
const { debug } = require("console");

let mongo_client = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;

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

function SendDataList(database, response, peticion){

	let testing;

	if(peticion == "characters"){
		testing  = database.collection(peticion).find({}, { projection: { name: 1} })
	} 
	else if(peticion == "items"){
		testing  = database.collection(peticion).find({}, { projection: { item: 1} })
	}

	testing.toArray(function(error,data){
		if(data.length != 0){
			dataToSend  = JSON.stringify(data);
			response.end(dataToSend);
			return;
			}
			else{
			response.end("DATA NOT FOUND");
			return;
			}
	})

}



http.createServer(function(request, response){
	response.writeHead(200);

	let saludo = "<h1>Muy buenos dias companero!</h1>";

	let array = [];

	let i = 0;

	let dataToSend;

	var peticion = request.url;
	
	if(peticion == "/"){
		fs.readFile("index.html", function (err, data){
			response.writeHead(200, {"Content-Type" : "text/html"});
			response.end(data);
			return;
		})
		return;
	}

	peticion = request.url.split("/");
	
	if(peticion.length == 2){
		SendDataList(database, response, peticion[1]);
	}
	else
	{
		if(peticion[2].length != 24){ 
			response.end();
			return ;
		}

		if(peticion[1] == "characters"){
			
			let obj_id = new ObjectId(peticion[2]);
			let colData = database.collection("characters").find({"_id":obj_id}, {projection:{ "name":1 } });
			colData.toArray(function(err, data){
				let string = JSON.stringify(data);
				response.end(string);
			});
		}
		else if(peticion[1] == "items"){
			let obj_id = new ObjectId(peticion[2]);
			let colData = database.collection("items").find({"_id":obj_id}, {projection:{ "item":1 } });
			colData.toArray(function(err, data){
				let string = JSON.stringify(data);
				response.end(string);
			});
		}
		else if(peticion[1] == "remove"){
			let obj_id = new ObjectId(peticion[2]);
			collectionName = peticion[3];
			database.collection(collectionName).deleteOne({"_id":obj_id});
			response.end("DELETED");
		}
	}
}).listen(1095);
