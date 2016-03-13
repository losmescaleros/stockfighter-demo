var express = require("express");
var app = express();
var server = require('http').Server(app);
var port = 3000;

var io = require('socket.io')(server);

var WebSocketClient = require('websocket').client;
 
server.listen(port);
console.log("Listening on port " + port);

app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	var client = new WebSocketClient();

	var account = socket.request._query['account'];
	var venue = socket.request._query['venue'];
	var symbol = socket.request._query['symbol'];

	console.log('Requesting connection to account ' + account + ', venue ' + venue + ', symbol ' + symbol);

	client.on('connectFailed', function(error) {
    	console.log('Connect Error: ' + error.toString());
	});

	client.on('connect', function(connection) {
		socket.emit('connected');
	    console.log('WebSocket Client Connected');

	    connection.on('error', function(error) {
	        console.log("Connection Error: " + error.toString());
	    });

	    connection.on('close', function() {
	        console.log('Connection Closed');
	        client.disconnect();
	    });

	    connection.on('message', function(message) {
	        if (message.type === 'utf8') {
	            // parse the JSON object out of the utf8 string
	            var data = JSON.parse(message.utf8Data);
	            // JSON will contain 'quote' and 'ok'
	            var quote = data.quote;
	            
	            socket.emit('message', data.quote);
	            console.log(quote);
	        }
	    }); 

	});	

	client.connect('wss://api.stockfighter.io/ob/api/ws/' + account + '/venues/' + venue + '/tickertape/stocks/' + symbol, null);
	console.log('Connected to websocket');
}); 
