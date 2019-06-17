const express = require('express');
const app = express();
app.use(express.static('public'));
const mysql = require('mysql');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var usernameG;
const fs = require('fs');
//database
let db = mysql.createConnection({
	host: 'a07yd3a6okcidwap.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
	user: 'm7479tvdnwwfimqo',
	password: 'jse16k4dx7nd6l8l',
	database: 'xpba22f95w8rrd8q'
});
db.connect((err) => {
	if (err) throw err;
	console.log('Database connected succesfully!!! =)');
});

//config
app.use(bodyParser.urlencoded({ extended: false }));

//Routes

//Register route
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/views/login.html');
});
app
	.route('/register')
	.get((req, res) => {
		res.sendFile(__dirname + '/public/views/register.html');
	})
	.post((req, res) => {
		let { email, password, username } = req.body;
		let squery = `INSERT INTO usuarios (usuario, email, contraseña) VALUES (${mysql.escape(
			username
		)}, ${mysql.escape(email)}, ${mysql.escape(password)});`;
		console.log(squery);
		db.query(squery, (err, response) => {
			if (err) {
				console.log(err);
				res.redirect('/register');
			} else {
				res.redirect('/');
			}
		});
	});

//Login route
app
	.route('/chat')
	.get((req, res) => {
		res.redirect('/');
	})
	.post(async (req, res) => {
		let { email, password } = req.body;
		db.query(`SELECT * from usuarios WHERE email='${email}' and contraseña='${password}';`, (err, response) => {
			if (err) {
				console.log(err);
				res.redirect('/');
			} else {
				console.log(response.length);
				if (response.length > 0) {
					usernameG = response[0].usuario;
					res.sendFile(__dirname + '/public/views/chat.html');
				} else {
					res.redirect('/');
				}
			}
		});
	});

//Load resources.
app.get('/styles/index.css', (req, res) => {
	res.sendFile(__dirname + '/public/styles/index.css');
});
app.get('/styles/chat.css', function(req, res) {
	res.sendFile(__dirname + '/public/styles/chat.css');
});
app.get('/chat.js', function(req, res) {
	res.sendFile(__dirname + '/public/codes/chat.js');
});
app.get('/images/background2.jpg', (req, res) => {
	res.sendFile(__dirname + '/public/images/background2.jpg');
});

const saveMessage = (messages) => {
	fs.writeFile(__dirname + '/chats/autosave', messages, (err) => {
		if (err) throw err;
		console.log('Message saved!');
	});
};

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.username = usernameG;
	fs.readFile(__dirname + '/chats/autosave', 'utf8', (err, data) => {
		if (err) throw err;
		socket.emit('loadMessages', data);
	});
	socket.on('new_message', (data) => {
		io.sockets.emit('new_message', { message: data.message, username: socket.username });
		saveMessage(data);
	});
});

http.listen(port, function() {
	console.log('listening on *:' + port);
});
