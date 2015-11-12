var redis = require('redis'); 
var db = redis.createClient();

//create test Account
var testEmail = "microbean@gmail.com";
db.incr('nextaccountId', function(err, id) {
	var newId = 'account:item:' + id;
	db.sadd('uniqueemail', testEmail);
	db.set('data:email:'+ testEmail, newId);

	db.zadd('readmodel:account:items', 0, newId , function(err) {	
		db.set('readmodel:account:item:1', "{\"email\":\"microbean@gmail.com\",\"nickName\":\"Kenny Lee\",\"birthday\":\"2014/11/01\",\"location\":\"Taipei\",\"password\":\"acefedc6e8ca8c02ec20fd912233dac503ef40d9707cdba7d10f655834fdd499cc95e94b235346cd15c2354c787c2f1f1409c8c533d3616838015107df750fef\",\"headPhoto\":\"defaulticon.png\",\"passwordSalt\":\"[5,10,28,113,168,104,233,208,0,91,70,63,248,73,108,48]\",\"defaultTagId\":\"tag:item:0\",\"id\":\"account:item:1\",\"tags\":[]}");
		db.set("eventstore:events:14166930398670:_general:_general:account:item:1:10", "{\"streamId\":\"account:item:1\",\"aggregateId\":\"account:item:1\",\"streamRevision\":0,\"commitId\":\"1\",\"commitSequence\":0,\"commitStamp\":\"2014-11-22T21:50:39.867Z\",\"payload\":{\"id\":\"msg25\",\"time\":\"2014-11-22T21:50:39.862Z\",\"sender\":\"192.168.1.44\",\"socketId\":\"Crqml2TAyMYd7Xx5AAAE\",\"payload\":{\"email\":\"microbean@gmail.com\",\"nickName\":\"Kenny Lee\",\"birthday\":\"2014/11/01\",\"location\":\"Taipei\",\"password\":\"acefedc6e8ca8c02ec20fd912233dac503ef40d9707cdba7d10f655834fdd499cc95e94b235346cd15c2354c787c2f1f1409c8c533d3616838015107df750fef\",\"headPhoto\":\"defaulticon.png\",\"passwordSalt\":\"[5,10,28,113,168,104,233,208,0,91,70,63,248,73,108,48]\",\"defaultTagId\":\"tag:item:0\",\"id\":\"account:item:1\",\"tags\":[],\"event\":\"accountCreated\"},\"commandId\":\"msg25\",\"event\":\"accountCreated\",\"command\":\"sendAccountVerifyMail\",\"returnSender\":true},\"id\":\"10\",\"restInCommitStream\":0}");
		db.set("nextItemId:eventstore", "2");
		
		//new Activity
		db.incr('nextaccountId', function(err, id) {
			db.mset("eventstore:events:14166950872590:_general:_general:activity:item:1:50","{\"streamId\":\"activity:item:1\",\"aggregateId\":\"activity:item:1\",\"streamRevision\":0,\"commitId\":\"5\",\"commitSequence\":0,\"commitStamp\":\"2014-11-22T22:24:47.259Z\",\"payload\":{\"id\":\"msg2_event_0\",\"payload\":{\"from\":\"Kenny Lee\",\"accountId\":\"account:item:1\",\"headPhoto\":\"defaulticon.png\",\"subject\":\"1\",\"desc\":\"1\",\"createdDate\":\"2014/11/01\",\"createdAge\":\"10\",\"timestamp\":1416695087255,\"comments\":[],\"media\":{\"filename\":\"best-job-search-advice-youre-fired-300x212 (3).jpg\",\"height\":212,\"width\":300,\"filepath\":\"/114/10/1\"},\"boardId\":\"1\",\"boardName\":\"\xe9\x89\x9b\xe7\xad\x86\",\"id\":\"activity:item:1\",\"likeCount\":0,\"likeAccount\":[],\"authorId\":\"account:item:1\"},\"commandId\":\"msg2\",\"event\":\"activityCreated\",\"time\":\"2014-11-22T22:24:47.258Z\"},\"id\":\"50\",\"restInCommitStream\":0}","eventstore:undispatched_events:14166950872590:_general:_general:activity:item:1:50","{\"streamId\":\"activity:item:1\",\"aggregateId\":\"activity:item:1\",\"streamRevision\":0,\"commitId\":\"5\",\"commitSequence\":0,\"commitStamp\":\"2014-11-22T22:24:47.259Z\",\"payload\":{\"id\":\"msg2_event_0\",\"payload\":{\"from\":\"Kenny Lee\",\"accountId\":\"account:item:1\",\"headPhoto\":\"defaulticon.png\",\"subject\":\"1\",\"desc\":\"1\",\"createdDate\":\"2014/11/01\",\"createdAge\":\"10\",\"timestamp\":1416695087255,\"comments\":[],\"media\":{\"filename\":\"best-job-search-advice-youre-fired-300x212 (3).jpg\",\"height\":212,\"width\":300,\"filepath\":\"/114/10/1\"},\"boardId\":\"1\",\"boardName\":\"\xe9\x89\x9b\xe7\xad\x86\",\"id\":\"activity:item:1\",\"likeCount\":0,\"likeAccount\":[],\"authorId\":\"account:item:1\"},\"commandId\":\"msg2\",\"event\":\"activityCreated\",\"time\":\"2014-11-22T22:24:47.258Z\"},\"id\":\"50\",\"restInCommitStream\":0}");			
			db.zadd("readmodel:activityview:1:items", 0, "activity:item:1", function(){
				db.zadd("readmodel:accountactivityview:1:account:item:1:items", 0, "activity:item:1", function(){
				db.set("readmodel:activity:item:1","{\"from\":\"Kenny Lee\",\"accountId\":\"account:item:1\",\"headPhoto\":\"defaulticon.png\",\"subject\":\"1\",\"desc\":\"1\",\"createdDate\":\"2014/11/01\",\"createdAge\":0,\"timestamp\":1416698991180,\"comments\":[],\"media\":{\"filename\":\"best-job-search-advice-youre-fired-300x212 (4).jpg\",\"height\":212,\"width\":300,\"filepath\":\"/114/10/1\"},\"boardId\":\"1\",\"boardName\":\"\xe9\x89\x9b\xe7\xad\x86\",\"id\":\"activity:item:1\",\"likeCount\":0,\"likeAccount\":[],\"authorId\":\"account:item:1\"}");
				db.set("readmodel:account:item:1","{\"email\":\"microbean@gmail.com\",\"nickName\":\"Kenny Lee\",\"birthday\":\"2014/11/01\",\"location\":\"Taipei\",\"password\":\"acefedc6e8ca8c02ec20fd912233dac503ef40d9707cdba7d10f655834fdd499cc95e94b235346cd15c2354c787c2f1f1409c8c533d3616838015107df750fef\",\"headPhoto\":\"defaulticon.png\",\"passwordSalt\":\"[5,10,28,113,168,104,233,208,0,91,70,63,248,73,108,48]\",\"defaultTagId\":\"tag:item:0\",\"id\":\"account:item:1\",\"tags\":[],\"viewName\":\"account\",\"AuthorActivityCount\":1}");
				process.exit(code=0);			
			});
			});	
		});			
	});
				
});	
