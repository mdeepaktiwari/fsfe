const http = require("http");

http.createServer( function(req, res){
	res.write("On the way to full stack");
	res.end();
}

).listen(3000);
