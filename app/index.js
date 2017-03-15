var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//app.listen(process.env.PORT || 8080);

http.listen(8080, function(){
  console.log('listening on: 8080');
});

io.on('connection', function(socket){
  console.log('a user connected');
});
