const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://127.0.0.1:5500',
	},
});

app.use(cors());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', socket => {
	console.log('a user connected with socket id', socket.id);

	socket.on('chat message', msg => {
		console.log('message: ' + msg);

		io.emit('send_messages_to_all_users', msg);
	});

	socket.on('typing', () => {
		socket.broadcast.emit('show_typing_status');
	});

	socket.on('stop_typing', () => {
		socket.broadcast.emit('clear_typing_status');
	});

	socket.on('disconnect', () => {
		console.log('left the chat with socket id ' + socket.id);
	});
});

//* emit → publish to an eventt using .emit('eventName', data)

//* on → listen to event using .on('eventName', callback)

server.listen(3000, () => {
	console.log('listening on http://localhost:3000');
});
