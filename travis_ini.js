var redis = require('redis'); 
var db = redis.createClient();

db.set("data","helloworld");
process.exit(code=0);
