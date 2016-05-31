var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });


  io.on('gyro', function(msg){
    console.log('message: ' + msg);
	});



	io.on('save', function(msg){

		//console.save(msg);
	    console.log('message: ' + msg);
	});


});



io.emit('gyro', { for: 'everyone' });
io.emit('motion', { for: 'everyone' });
io.emit('save', { for: 'everyone' });

