$(function() {
	let socket = io.connect('https://blockroom.herokuapp.com');

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

$(document).ready(function() {
	$('.scrollspy').scrollSpy();
});
