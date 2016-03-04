// Account, venue, and symbol will change with every problem session. Be sure to update them. 
// The test index won't work with the stream... so you'll have to replace the account, venue, and 
// symbol
var account = 'SAP12306403';
var venue = 'APEMEX';
var symbol = 'ITBE';

var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();

var request = require('request');
 
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function() {
        console.log('Connection Closed');
    });

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // parse the JSON object out of the utf8 string
            var data = JSON.parse(message.utf8Data);
            // JSON will contain 'quote' and 'ok'
            var quote = data.quote;
            console.log(quote);
        }
    });    
});

 
client.connect('wss://api.stockfighter.io/ob/api/ws/' + account + '/venues/' + venue + '/tickertape', null);