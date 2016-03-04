var account = 'SB56812489';
var venue = 'ETABEX';
var symbol = 'POH';

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
            console.log(quote.last);
        }
    });
    
    
});
 
// client.connect('wss://api.stockfighter.io/ob/api/ws/' + account + '/venues/' + venue + '/tickertape', null);

var requestLimitOrder = function(symbol, quantity, price, venue, account) {
    var data = {      
      "account" : account,
      "venue": venue,
      "stock": symbol,
      "price": price,
      "qty": quantity,
      "direction": "buy",
      "orderType": "limit",
    };

    var options = {
        url: 'https://api.stockfighter.io/ob/api/venues/' + venue + '/stocks/' + symbol + '/orders',
        headers: {
            'X-Starfighter-Authorization': 'c86c741989ca560cdb9dbe52dfd2468d17980a11'
        }, 
        json: data
    };
    request.post(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log(error);
        }
    });
}

requestLimitOrder(symbol, 100000, 8000, venue, account);