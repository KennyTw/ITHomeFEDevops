var redis = require('redis'); 
var db = redis.createClient();

db.set("data","helloworld");
db.get("data",function (err , data) {
	if (data) {
		console.log("redis data : " + data);
		process.exit(code=0);	
	}
})

