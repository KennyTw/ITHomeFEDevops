//view namespace initial
//kidart.Views = kidart.Views || {};
var ItemsCollection = require("../collections/ItemsCollection");
var ItemView = require("./ItemView");
var ClientStatusModel = require("../models/ClientStatusModel");
var util = require('utility');
//var i18n = require('i18next');
//(function () {
    'use strict';	

    //kidart.Views.IndexView = Backbone.View.extend({	
	module.exports = Backbone.View.extend({
		el: $('body'),

        initialize: function() {
			//variable initial			 
			var isLoading = false;			
			kidart.sorted = 0;
			kidart.page = 1;
			kidart.profilelike = 0;
			kidart.boardId = 0;
			//artworkconter = kidart.BoardArtworkConter;
			
			
			//i18n.init({
					//lng: kidart.userLang,
					//fallbackLng: "zh-TW",
					//supportedLngs: ['zh-TW', 'zh-CN', 'en-US'],
					//resGetPath: "/locales/resources.json?lng=__lng__&ns=__ns__",
					//dynamicLoad: true,
					//debug: true
				//}, function() { 
					//$('#adhead1').text(kidart.i18n.t("index.adhead1"));
					//$('#adtext1').text(kidart.i18n.t("index.adtext1"));
					//$('#adhead2').text(kidart.i18n.t("index.adhead2"));
					//$('#adtext2').text(kidart.i18n.t("index.adtext2"));
					//$('#adhead3').text(kidart.i18n.t("index.adhead3"));
					//$('#adtext3').text(kidart.i18n.t("index.adtext3"));
					//kidart.ListArtwork = kidart.i18n.t("list.
			//});
			
			
			//var items = new kidart.Collections.ItemsCollection();
			kidart.items = new ItemsCollection();

			
			// itemCreated event 
			var activityCreateHandler = new Backbone.CQRS.EventDenormalizer({
				methode: 'create',
				//model: kidart.Models.ItemModel,
				collection: kidart.items,
							  
				// bindings
				forModel: 'item',
				forEvent: 'activityCreated'
			});	

			// itemChanged event
			var activityChangedHandler = new Backbone.CQRS.EventDenormalizer({
				forModel: 'item',
				forEvent: 'activityChanged'
			});

			// itemDeleted event 
			var activityDeletedHandler = new Backbone.CQRS.EventDenormalizer({
				methode: 'delete',

				// bindings
				forModel: 'item',
				forEvent: 'activityDeleted'
			});	

			var likeActivityCreateHandler = new Backbone.CQRS.EventDenormalizer({				
				//onHandle: function(data, model) {console.log('onHandle:' + data + ',' + model )},
				forModel: 'item',
				forEvent: 'likeActivityCreated'				
			});		

			var likeActivityDeleteHandler = new Backbone.CQRS.EventDenormalizer({				
				//onHandle: function(data, model) {console.log('onHandle:' + data + ',' + model )},
				forModel: 'item',
				forEvent: 'likeActivityDeleted'				
			});				
			
			var serverdata = JSON.parse($("#ServerData").html());
			//console.log(serverdata);
			if (serverdata.accountData) {
				//console.log("abc");
				if (typeof serverdata.accountData.profileImage !== 'undefined') {
					//console.log("xyz");
					$("#profileCarousel").css("display","block");
					//$("#profileCarouselImage").css('background-image', 'url(/images/org/' + serverdata.accountData.profileImage + ')');
					var profileimgurl = serverdata.accountData.profileImage;
					//$("#profileCarouselImage").css('background-image', 'url(' + serverdata.accountData.profileImage + ')');
					$("#profileCarouselImage").css('background-image', 'url(\"' + profileimgurl + '\")');
				}
			}

			//console.log(serverdata);
			kidart.items.reset(serverdata.boardactivity); 
			var boardcount = serverdata.boardCount;
			//console.log("xyz:"+artworkconter);
			//$("#labelcounter").text(boardcount + " 件作品");
			//$("#labelcounter_phone").text(boardcount + " 件作品");
			$("#labelcounter").text(boardcount);
			$("#labelcounter_phone").text(boardcount);
            _.bindAll(this, 'addItem');

            this.collection = kidart.items;
            this.collection.bind('reset', this.render, this);
            this.collection.bind('add', this.addItemBind, this);
			
			//client status initial
			var clientStatusHandler = new Backbone.CQRS.EventDenormalizer({			 
				forModel: 'clientstatus',
				forEvent: 'clientStatus'
			});	
			
			//must let model.id equal to  response event's payload.id
			//new kidart.Models.ClientStatusModel({id:'clientstatus'});
			new ClientStatusModel({id:'clientstatus'});
			
			//onscroll 
			var onScroll = function (event) { 
			//console.log('onScroll :' + isLoading);
			if (!isLoading){	
				var winHeight = window.innerHeight ? window.innerHeight : $(window).height();// iphone fix				
				closeToBottom = ($(window).scrollTop() + winHeight > $(document).height() - 1000);
				//util.showMessage(($(window).scrollTop() + winHeight) - ($(document).height() - 1000) ,"info");				
				if(closeToBottom) {
					 //console.log('closeToBottom:' + ($(window).scrollTop() + winHeight) + ',' + ($(document).height() - 100));
					var nextitems = new ItemsCollection();
					console.log('load page:' + kidart.page);
					isLoading = true;
					kidart.page++;	

					if (kidart.page == 1) {
						this.$('#tiles').empty();
						kidart.items.reset(); //clean for first page collection
					}
					
					var accountId = 0;
					if (window.location.pathname.substring(0,8) == "/profile") {
						accountId = util.getCookie('accountId');
						if (window.location.pathname.substring(0,9) == "/profile/") {
							accountId = window.location.pathname.substring(9,window.location.pathname.length);
						}
					} else if(window.location.pathname.indexOf("/",1) == -1){
						accountId = window.location.pathname.substring(1, window.location.pathname.length);
					}

					if (window.location.pathname.substring(0,6) == "/group") {
						var pathname = window.location.pathname;
						var arr = pathname.split("/");
						if (arr.length > 3) {
							kidart.boardId = arr[2];
							accountId = arr[3];
						} else {
							kidart.boardId = arr[2];
							accountId = "account:item:1";
						}
						kidart.profilelike = 1;
					}
									
					nextitems.fetch({
								data: {page : kidart.page , boardId : kidart.boardId , sorted : kidart.sorted  , accountId : accountId , profilelike : kidart.profilelike } ,  
								success: function(collection, response, options){
									isLoading = false;									
									var activityObj = nextitems.models[0].get("boardactivity"); 
									if (activityObj.length > 0) {
										nextitems.reset(activityObj);									
										nextitems.each(function(model, index) {
												if (kidart.page == 1)
												    model.set({CancelNotify:true,AppendToEnd:false});
												else
													model.set({CancelNotify:true,AppendToEnd:true});
												//model.set({AppendToEnd:true})											
												kidart.items.add(model);									
										});
										
									} else {
										if (kidart.page > 1)
											kidart.page--;
									}	
									accountId = util.getCookie('accountId');
								},
								error: function(collection, response, options) {
									isLoading = false;	
									console.log('Failed to fetch! ' + response.responseText);
									accountId = util.getCookie('accountId');
								}});
					}
				}
			}
			//initial scroll 
			$(window).on("scroll", function (event) {	
				//trigger only in infinite scroll pages
				if (window.location.pathname == "/" || window.location.pathname.substring(0,8) == "/profile" || window.location.pathname.substring(0,6) == "/group" || window.location.pathname.indexOf("/",1)==-1)
					onScroll(event);
			});
			
			if(this.getUrlParameter('d')=="ai2") {
				$('.body').attr('padding-top','0px');
				if (this.getUrlParameter('f')=="index") {
						//alert(this.getUrlParameter('f'));
						$("#subnav").attr("style", "display: none !important");
						$("#myCarousel").attr("style", "display: none !important");
						$("body").css("margin-top","-40px");
						$("row").addClass("clearfix");
						$("#navbar-wrapper").addClass("clearfix");
				} else if (this.getUrlParameter('f')=="login"){
						//alert(this.getUrlParameter('f'));
						$("body").removeAttr( "style");
						$("body").removeClass();
						$("body").css("margin-top","-30px");
							//changePasswordModal
							$("#top-wrapper").css("width","100%");
							$("#top-wrapper").height(0);
							$("#top-wrapper").width('98%');
								$("#subnav").removeClass( "navbar-fixed-top" );
								$("#subnav").height(0);
								$("#subnav").css("min-height","0px");
									$("#navHeader").height(0);
									$("#navHeader").css("border-bottom-width","0");
									$("#navHeader").removeClass("navbar navbar-default");
										$("#navbarheader2").addClass("displaynone");
										$("#navbarheader2").removeClass("navbar-header");
										//$("#navbar-collapse2").addClass("displaynone");
										$("#navbar-collapse2").removeClass("navbar-collapse collapse");
										$("#navbar-collapse2").height(0);
											$("#ulnavbar").removeClass("nav navbar-nav navbar-right");
												$("#museum").addClass("displaynone");
												$("#search").addClass("displaynone");
												$("#newArtwork").addClass("displaynone");
												//userlogin
													$("#login-switch").addClass("displaynone");
													$("#loginview").addClass("displayshow");
													$("#loginview").css("margin-left","3px");
													$("#loginview").css("position","relative");
													$("#loginview").css("float","center");
												$("#language").addClass("displaynone");
											
								//newArtworkModal
								//forgetPasswordModal
								$("#myCarousel").addClass("displaynone");
								
							$("#navbar-wrapper").css("width","100");
								$("#subnav2").addClass("displaynone");
								$("#subnav3").addClass("displaynone");
								$("#container").addClass("displaynone");

								$("#debug").addClass("displaynone");
				}
			}

			// init i18next in script block
			//var i18n = require('i18next');
			//var userLang = navigator.language || navigator.userLanguage;
        },

        events: {
           // 'click #addItem' : 'uiAddItem' //,
		//	'itemredraw': 'redraw'
		     'click #formsubmit' : 'uiAddItem' ,
			 'click #MultiColumnMode' : 'uiMultiColumn',
			 'click #SingleColumnMode' : 'uiSingleColumn',
             'click #Wanted' : 'uiWanted',
			 'click .listhot' : 'uiListhot',
			 'click .listnew' : 'uiListnew',
			 'change .indexBoradId' : 'uiBoardSelectChange',
			 'resize window ' : 'uiWIndowResize',
			 'change #channelSelect' : 'actionCannelChanged',
			 'click #fbshareProfile' : 'uiFbshareProfileClick'
		},
		uiFbshareProfileClick : function () {
				if (location.href.match(/account:item/) == null) {
					var myhref = location.href + '/' + util.getCookie('accountId');
					var FBHref = encodeURIComponent(myhref).replace(/['()]/g, escape).replace(/\*/g, '%2A').replace(/%(?:7C|60|5E)/g, unescape);
				} else {
					var FBHref = encodeURIComponent(location.href).replace(/['()]/g, escape).replace(/\*/g, '%2A').replace(/%(?:7C|60|5E)/g, unescape);
				}
				var url = "https://www.facebook.com/dialog/share?app_id=667957026632476&display=popup&href="+FBHref+"&redirect_uri="+FBHref;	
				var windowName = "popUp";
				window.open(url, windowName);
		},
		actionCannelChanged: function(e) {
			console.log("已選擇:"+$( "#channelSelect option:selected" ).text());
			var selectValue = $( "#channelSelect option:selected" ).val();
			if(selectValue == "GuangYuan") {
				window.location="/guangyuan";
			} else if (selectValue == "BestRadio") {
				window.location="/bestradio";
			} else {
			}
		},
		uiWIndowResize: function() {
			console.log('Window is resized');
			if (kidart.WookmarkHandle) {
				kidart.WookmarkHandle = $(kidart.WookmarkHandle.selector); //re select
				kidart.WookmarkHandle.wookmark(kidart.WookmarkOptions);			
			}
		},
		uiBoardSelectChange : function(sender) {			
			$('#tiles').empty();
			
			var nextitems = new ItemsCollection();					
			kidart.page = 1;
			kidart.boardId = sender.currentTarget.value;
			
			var accountId = 0;
			if (window.location.pathname.substring(0,8) == "/profile") {
				accountId = util.getCookie('accountId');
				if (window.location.pathname.substring(0,9) == "/profile/") {
					accountId = window.location.pathname.substring(9,window.location.pathname.length);
				}
			}

			nextitems.fetch({
						data: {page : kidart.page , boardId : kidart.boardId , sorted : kidart.sorted , accountId : accountId , profilelike : kidart.profilelike, role : kidart.role} ,  
						success: function(collection, response, options){															
							var activityObj = nextitems.models[0].get("boardactivity"); 
							var boardcount = nextitems.models[0].get("boardCount");
							if (boardcount == 'undefined' || boardcount == null) {
								boardcount = 0;
							}
							$("#labelcounter").text(boardcount);
							$("#labelcounter_phone").text(boardcount);
							$("#tagcounter").text(boardcount);
							$("#tagcounter_phone").text(boardcount);
							nextitems.reset(activityObj);
							nextitems.each(function(model, index) {
								if (kidart.sorted == 0)
									model.set({CancelNotify:true,AppendToEnd:false})
								else	
									model.set({CancelNotify:true,AppendToEnd:true});
								//model.set({AppendToEnd:true});
								//kidart.items.add(model);									
							});
							
							kidart.items.reset(nextitems.toJSON());
							
							if (kidart.WookmarkHandle)
							{
								kidart.WookmarkHandle = $(kidart.WookmarkHandle.selector); //re select
								kidart.WookmarkHandle.wookmark(kidart.WookmarkOptions);			
							}
							
						},
						error: function(collection, response, options) {							
							console.log('Failed to fetch! ' + response.responseText);
						}});
			
		},
		uiListhot : function() {
			
			$('#tiles').empty();
			$('.listhot').addClass("text-decoration-under");
			$('.listnew').removeClass("text-decoration-under");
			
			var nextitems = new ItemsCollection();					
			kidart.page = 1;
			kidart.sorted = 1;
			
			var accountId = 0;
			if (window.location.pathname.substring(0,8) == "/profile") {
				accountId = util.getCookie('accountId');
				if (window.location.pathname.substring(0,9) == "/profile/") {
					accountId = window.location.pathname.substring(9,window.location.pathname.length);
				}
			}
			
			nextitems.fetch({
						data: {page : kidart.page , boardId : kidart.boardId , sorted : kidart.sorted ,accountId : accountId  , profilelike : kidart.profilelike} ,  
						success: function(collection, response, options){															
							var activityObj = nextitems.models[0].get("boardactivity"); 
							var boardcount = nextitems.models[0].get("boardCount");
							if (boardcount == 'undefined' || boardcount == null) {
								boardcount = 0;
							}
							//$("#labelcounter").text(boardcount + " 件作品");
							//$("#labelcounter_phone").text(boardcount + " 件作品");
							$("#labelcounter").text(boardcount);
							$("#labelcounter_phone").text(boardcount);
							$("#tagcounter").text(boardcount);
							$("#tagcounter_phone").text(boardcount);
							nextitems.reset(activityObj);
							nextitems.each(function(model, index) {
								model.set({CancelNotify:true,AppendToEnd:true});
								//model.set({AppendToEnd:true});
								//kidart.items.add(model);									
							});
							
							kidart.items.reset(nextitems.toJSON());
							
							if (kidart.WookmarkHandle)
							{
								kidart.WookmarkHandle = $(kidart.WookmarkHandle.selector); //re select
								kidart.WookmarkHandle.wookmark(kidart.WookmarkOptions);			
							}
							
						},
						error: function(collection, response, options) {							
							console.log('Failed to fetch! ' + response.responseText);
						}});
		},
		uiListnew : function() {			
			$('#tiles').empty();			
			$('.listnew').addClass("text-decoration-under");
			$('.listhot').removeClass("text-decoration-under");	
			
			var nextitems = new ItemsCollection();					
			kidart.page = 1;
			kidart.sorted = 0;
			
			var accountId = 0;
			if (window.location.pathname.substring(0,8) == "/profile") {
				accountId = util.getCookie('accountId');
				if (window.location.pathname.substring(0,9) == "/profile/") {
					accountId = window.location.pathname.substring(9,window.location.pathname.length);
				}
			}
			
			nextitems.fetch({
						data: {page : kidart.page , boardId : kidart.boardId , sorted : kidart.sorted , accountId:accountId  , profilelike : kidart.profilelike} ,  
						success: function(collection, response, options){															
							var activityObj = nextitems.models[0].get("boardactivity"); 
							var boardcount = nextitems.models[0].get("boardCount");
							//$("#labelcounter").text(boardcount + " 件作品");
							//$("#labelcounter_phone").text(boardcount + " 件作品");
							if (boardcount == 'undefined' || boardcount == null) {
								boardcount = 0;
							}
							$("#labelcounter").text(boardcount);
							$("#labelcounter_phone").text(boardcount);
							$("#tagcounter").text(boardcount);
							$("#tagcounter_phone").text(boardcount);
							nextitems.reset(activityObj);
							nextitems.each(function(model, index) {
								model.set({CancelNotify:true,AppendToEnd:false});
								//model.set({AppendToEnd:true});
								//kidart.items.add(model);									
							});
							
							kidart.items.reset(nextitems.toJSON());
							
							if (kidart.WookmarkHandle)
							{
								kidart.WookmarkHandle = $(kidart.WookmarkHandle.selector); //re select
								kidart.WookmarkHandle.wookmark(kidart.WookmarkOptions);			
							}
							
						},
						error: function(collection, response, options) {							
							console.log('Failed to fetch! ' + response.responseText);
						}});
		},
		uiMultiColumn : function() {			
			kidart.ItemWidth = 230;	
			this.$('#tiles').empty();
			kidart.WookmarkHandle = true;
			Backbone.CQRS.eventHandler.removeDenormalizer('comment');
			this.render();
			kidart.WookmarkHandle =  $("#tiles li"); //re select
			kidart.WookmarkHandle.wookmark(kidart.WookmarkOptions);	
		},
		uiSingleColumn : function() {
			kidart.WookmarkHandle.wookmarkInstance.clear();
			kidart.WookmarkHandle = false;			
			this.$('#tiles').empty();
			Backbone.CQRS.eventHandler.removeDenormalizer('comment');
			this.render();
			
			//re-render view
			//kidart.ViewInstance.IndexView.$el.remove();
			//var indexView = new kidart.Views.IndexView();
			//kidart.ViewInstance.IndexView.render();	

			//kidart.ViewInstance.indexView = indexView;
		},
		uiWanted :function() {
			location.replace('999999'); 
		},
		uiAddItem: function(e) {
		
			var itemText = this.$('#newItemText').val();			 
			var from = this.$('#newItemFrom').val();
			var creator = this.$('#creator').val();
			var filename = this.$('#filename').val();
			if (itemText && filename && from) {
              this.$('.close').click();			 
			}
		},
        render: function() {
        	//var viewData = this.document.getElementById("ServerData").valueOf().innerText;
        	//var counter = JSON.parse(ServerData.valueOf().textContent).boardactivity.length;
        	//$("#labelcounter").html("共 " + counter + " 件");
			//$("#labelcounter_phone").html("共 " + counter + " 件");
            this.collection.each(this.addItem);
			//$("#myCarousel .item div:gt(10)").attr('id');
        },
		addItemBind : function(item) {
			this.addItem(item);
			
			if (item.get("CancelNotify") != true && item.get("accountId") != util.getCookie('accountId')) {
				//util.incTitleCounter();
				//var msg = "新作品發表 標題 : " + item.get("subject") + " 作者 : " + item.get("from") + "   &nbsp;<a target='new' href='/artwork/" + item.get("id")  + "' style='text-decoration: none;'>  <i class='glyphicon glyphicon-share-alt'></i></a>";
				//util.showDismissMessage( msg ,"info");				
				//util.setTileCentralInfo('最新作品發表');
				//util.addContentCentralInfo(msg,item.get("media"),item.get("id"),item.get("authorId"),item.get("subject"),item.get("timestamp"),'status');
				//var dataobj = {};
				//dataobj['content'] = msg;
				//dataobj['media'] = item.get("media");
				//util.addStorage('status:' + util.getCookie('accountId'),dataobj);	
			}
			//wookmark reload
			//wookmark reload
			if (kidart.WookmarkHandle)
			{
				kidart.WookmarkHandle = $(kidart.WookmarkHandle.selector); //re select
				kidart.WookmarkHandle.wookmark(kidart.WookmarkOptions);			
			}
		},
        addItem: function(item) {
		    //console.log(item.toJSON());
            //var view = new kidart.Views.ItemView({model: item});
					//kidart.i18n.init(function(t){
						//kidart.ListArtwork = t("list.artwork");
						//console.log("itemlistartwork in indexview:"+kidart.ListArtwork);
					//});
					//var itemListLike = kidart.i18n.t("list.like");
					//console.log("itemlistartwork in indexview:"+itemListArtwork);
					
			var view = new ItemView({model: item});
			var elobj = view.render().$el;
			
			//view.render().$el.prop('style').cssText = "display:inline"; //change default style to inline
			//elobj.prop('style').cssText = "display:inline-block;vertical-align: top;"; //change default style to inline
			//this.$('#items').prepend(elobj.hide().fadeIn('slow'));
			if (item.get("AppendToEnd") == true) {
				this.$('#tiles').append(elobj.show());
			} else {
				this.$('#tiles').prepend(elobj.show());				 
			}
			
			// remove tts by TK 2015-05-22
			//if(!kidart.md.mobile()) {
				//if (typeof TTS == 'function') { 
				  //view.ttsinit();
				//}
			//}
        },
		getUrlParameter: function (sParam){
			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');
			for (var i = 0; i < sURLVariables.length; i++) 
			{
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == sParam) 
				{
					return sParameterName[1];
				}
			}
		}
    });
//})();
