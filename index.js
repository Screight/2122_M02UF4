#!/usr/bin/node


let http = require("http");

http.createServer(function(request, response){
	response.writeHead(200);

	let saludo = "<h1>Muy buenos dias companero!</h1>";

	response.end(saludo);

}).listen(1095);
