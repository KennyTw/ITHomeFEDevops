// server.js is the starting point of the host process:
//
// `node server.js`
var express = require('express') 
  , cmd = require('redis-cli')
  , domain = require('domain')
  , serverDomain = domain.create()
  , gracefulExit = require('express-graceful-exit') 
  , app = express()
  , http = require('http'); 

serverDomain.on('error', function(err){	
        console.log("serverDomain error:"  + err.stack);		
});

// all code must in this scope
serverDomain.run(function() {
	var server = http.createServer(app);	
	/* ---------------- server domain ------------ */
	process.on('message', function(message) {
	 if (message === 'shutdown') {
	   gracefulExit.gracefulExitHandler(app, server,{log:true,suicideTimeout:6*1000});
	   console.log("server message shutdown");
	  // process.exit(0);
	 } else {
		console.log(message);
	 }
	});

	function sendOfflineMsg() {
	   console.log("server sendOfflineMsg");
	   if (process.send) process.send('offline')
	}

	function doGracefulExit(err) {
	 console.log("server doGracefulExit:" + err.stack );
	 gracefulExit.gracefulExitHandler(app, server,{log:true,suicideTimeout:6*1000});
	}

	/* ---------------- server domain ------------ */
	app.use(gracefulExit.middleware(app))
	app.use(function (req, res, next) {
		var reqDomain = domain.create();
		reqDomain.add(req);
		reqDomain.add(res);

		res.on('close', function() {
		  reqDomain.dispose();
		})

		// Only process one error, the rest we will ignore
		reqDomain.once('error', function(err) {
			console.log("reqDomain error:" + err.stack);
			sendOfflineMsg(err);
			res.writeHeader(500, {'Content-Type' : "text/html"});
			res.write("<br><br><center><h2>Sorry ! Something Wrong !</h2><h4>We had reported it to our engineer.</h4><h5>- cicisasa developer team -</h5><h5>Back to <a href='/'>Home</a></h5></center>");
			res.end();
			
			doGracefulExit(err);
		})

		reqDomain.run(next);
	});	

	app.use(express['static'](__dirname + '/../../client'));
	// temp solution without browserity
	app.use("/bower_components", express['static'](__dirname + '/../../../bower_components'));
	app.set('view engine', 'jade');
    app.set('views', __dirname + '/../../template');	
	
	app.get('/', function(req, res) {
		res.render('index',{});		
	});
	
	app.post('/travis_web_hook',function(req, res) { 	
	    //identify with remote IP
		var ip = req.headers['x-forwarded-for'] || 
				 req.connection.remoteAddress || 
				 req.socket.remoteAddress ||
				 req.connection.socket.remoteAddress;
				 
		console.log(ip);
		console.log(req.body);	
		
		spawn('grunt', [],{cwd: '/home/ubuntu/codev2'});		
		console.log("spawn grunt!");				 
		
		res.end();	
	});

	var port = 80;	
	console.log(colors.cyan('\nStarting server on port ' + port));
	server.listen(port);
	
	server.on('listening', function() {
		console.log('server online');
		if (process.send) process.send('online');
	})
});