if (!pc) {
	var pc = {};
	pc.script = (function() {
		var script = {
			 create: function (name, callback) {
				console.log(name);
				callback()();
			}
		};
		return script;
	}());
}

// It's likely the server can be stateless and not require socket.io at all.

pc.script.create('MetaServer', function (context) {

    var MetaServer = function (entity) {

		gameServers = {};

		this.express = require('express');
		this.app = this.express();
		this.http = require('http').Server(this.app);
		this.io = require('socket.io')(this.http);
		this.app.use(express.static(__dirname));

		this.io.on('connection', function (socket) {
			socket.on('GameServerStats', function () {
				MetaServer.prototype.GameServerStats(socket, arguments);
			});
			socket.on('PlayerInstanceRequest', function () {
				MetaServer.prototype.PlayerInstanceRequest(socket);
			});
		        socket.on('disconnect', function () {
				MetaServer.prototype.ClientDisconnect(socket);
            		});
		});

		var defaultPort = 8088;
		module.exports = this.http.listen(process.env.PORT || defaultPort);

		console.log('express server started on port %s', process.env.PORT || defaultPort);

		this.http.on('error', function (e) {
		  if (e.code == 'EADDRINUSE') {
		    console.log('Address in use, exiting...');
		  }
		});
	};


	MetaServer.prototype = {
		GameServerStats: function (socket, arguments) {
			console.log(arguments[0]+" "+arguments[1]+" player"+(arguments[1] != 1 ? "s." : "."));
			gameServers[arguments[0]] = arguments[1];
		},
		PlayerInstanceRequest: function(socket) {
			socket.emit('Stats', gameServers);
		},
		ClientDisconnect: function (socket) {
			delete gameServers[socket.handshake.headers.referer];
		}
	};

	return MetaServer;
});
