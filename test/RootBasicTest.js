var request = require('supertest');
var should = require('should');

describe('Basic Server Test', function(){
  this.timeout(10000); //timeout with 10 secs
  it('Get / should respond 200 and check some keyword', function(done){
    request("http://127.0.0.1:3000")
      .get('/')   
      .expect(200, done)
	  .end(function(err,res) {
		var body = res.text;		
		body.should.containEql('/js/bundle.js');
		body.should.containEql('helloworld');		
		done(err);
	  });
  })   
})