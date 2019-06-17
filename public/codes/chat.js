$(function() {
	let socket = io.connect('http://localhost:3000');

	let message = $('#message');
	let send_message = $('#send_message');
	let chatroom = $('#chatroom');

	send_message.click(function() {
		socket.emit('new_message', { message: message.val() });
	});

	socket.on('new_message', (data) => {
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ': ' + data.message + '</p>');
	});

	socket.on('loadMessages', (data) => {
		chatroom.innerHTML = data;
	});
});
