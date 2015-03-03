pc.script.create('PlayerClient', function(context) {
	var PlayerClient = function (entity) {
		var socket = io();
		this.entity = entity;
		this.socket = socket;
		this.position = [0,0,0,0]; // x, y, z, time
		this.orientation = [0,0,0]; // x, y, z
	};
	PlayerClient.prototype = {
		servermessage: function(msg) {
			console.log(msg);
		},
		serverupdate: function(playernumber, position, orientation) {
			console.log(playernumber);
			console.log(position);
			this.position = position;
			console.log(orientation);
			this.orientation = orientation;
		},
		serverscore: function(playernumber, score) {
			console.log(playernumber+" "+score);
		},
		servercapability: function() {
			if ( history.pushState ) {
				var href = location.href;
				var i = href.indexOf("?");
				if (i >= 0) {
					href = href.substring(0, i);
				}
				history.pushState( {}, document.title, href+"?"+arguments[0].id );
			}
			this.player = arguments[1];
		},
		move: function(position, orientation) {
			this.socket.emit('clientmove', position, orientation);
		},
		delta: function(deltaposition, deltaorientation) {
			this.position[0] += deltaposition[0];
			this.position[1] += deltaposition[1];
			this.position[2] += deltaposition[2];
			this.position[3] += deltaposition[3];
			this.orientation[0] += deltaorientation[0];
			this.orientation[1] += deltaorientation[1];
			this.orientation[2] += deltaorientation[2];
			move(position, orientation);
		}
	};
	PlayerClient.socket.on('servermessage', Player.prototype.servermessage);
	PlayerClient.socket.on('serverupdate', Player.prototype.serverupdate);
	PlayerClient.socket.on('serverscore', PlayerClient.prototype.serverscore);
	PlayerClient.socket.on('servercapability', PlayerClient.prototype.servercapability);
	PlayerClient.socket.emit('clientrejoin', location.href);
	
	return PlayerClient;
});
