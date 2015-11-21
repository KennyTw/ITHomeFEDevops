var request = require('supertest');
var should = require('should');
var phantom = require('phantom');

describe('Basic Client Test with PhantomJS', function(){
	var page;  
	this.timeout(30000); //timeout with 30 secs
	before(function (done) {
			// get our browser and server up and running
			phantom.create(function (ph) {
				ph.createPage(function (tab) {
					page = tab;
					done();               
				});
			});
	});
  
	it('get / should return data back and no js error', function (done) {  
		page.set('onError', function(error) {
			console.log('onError:' + error);
			done(error);
		});		 
        page.open('http://127.0.0.1:3000', function (status) {
			console.log('Status: ' + status);          
                page.evaluate(function () { return document.title; }
				   , function (result) {                    
                    console.log("document.title:" + result);
					if (result.length > 0) {
						done();	
					} else {
						done("document.title null");
					}
                });           
        });
    });	
})