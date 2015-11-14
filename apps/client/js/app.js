 /* js application initial */
require('jquery');
require('bootstrap');

//set backbone/underscore to global
window.Backbone = require('backbone');
window._ = require('underscore');
Backbone.$ = $;

var IndexView = require("./views/IndexView");
/*global kidart, $*/
window.kidart = {
    Models: {},
    Collections: {},
	CollectionsInstance : {} ,
    Views: {},
	ViewInstance : {} ,
    Routers: {},
    init: function () {
        'use strict';
        console.log('Hello from Backbone!');	
		var indexView = new IndexView();
        indexView.render();
		this.ViewInstance.IndexView = indexView;
	}
};

kidart.init();

