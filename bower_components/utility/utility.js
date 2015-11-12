(function(exports){
	//setcookie
	exports.setCookie  = function(cname, cvalue, exdays) {
	    if (exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+d.toGMTString();
			document.cookie = cname + "=" + cvalue + ";path=/; " + expires ;
		} else {
			document.cookie = cname + "=" + cvalue + ";path=/";
		}
	};
	
	//getcookie
	exports.getCookie = function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i].trim();
	        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	    }
	    return "";
	};	
	
	//showmessage
	exports.showMessage = function(text,type) {
	    var opts = {
						title: text,
						stack: window.kidart.pnotify_stack_bar_top,
						delay: 3000,
						opacity: .70,
						width: "40%",
						type:type ,
						before_open: function(PNotify){
							// Position this notice in the center of the screen.
							var width = "40%";
							var widthnum = 0.4;
							
							var left =  ($(window).width() / 2) - ($(window).width() * widthnum / 2);
							if ($(window).width() <= 360){
								width = "100%";
								left = 0;
							}
							   
							PNotify.get().css({
								"top" : 0 ,
								"left": left ,
								"width" : width
							});
						}
					};			
		new PNotify(opts);
	};	
	
	//type : success, info, warning, danger
	exports.showDismissMessage = function(text,type,clickcallback) {		
		if (type == undefined || type == "") type = "warning";
	    var data = {text:text,type:type};
		window.kidart.ViewInstance.DismissibleAlertView.render(data,clickcallback);		
	}
	
	exports.showCentralInfo = function() {	    
		window.kidart.ViewInstance.CentralInfoView.show();		
	}
	
	exports.closeCentralInfo = function() {	    
		window.kidart.ViewInstance.CentralInfoView.close();		
	}	
	
	
	exports.addContentCentralInfo = function(content,
											 contentId,
											 mediaobj,
											 headPhoto,
											 headPhotoPath,
											 id,
											 fromAccountId,
											 subject,
											 time,
											 type,
											 subtype) {													
		var jsondata = {content:content,
						contentId : contentId,
						media:mediaobj,
						headPhoto:headPhoto,
						headPhotoPath:headPhotoPath,
						id:id,
						fromAccountId : fromAccountId,
						subject :  subject,
						time:this.formatTimeScale(time),
						type:type,
						subtype:subtype,
						status:'unread'};
		window.kidart.ViewInstance.CentralInfoView.addContent(jsondata);		
	}
	
	exports.isShowCentralInfo = function() {	    
		return window.kidart.ViewInstance.CentralInfoView.isShow;		
	}
	
	exports.getCentralInfoCount = function() {	    
		return window.kidart.ViewInstance.CentralInfoView.count;		
	}
	
	//sendAccountMessage
	exports.sendAccountMessage = function(toId,
										  subject,
										  contentId,
										  desc,
										  type,
										  callback) {		
		//type : status , '' = inbox	
		var meta = $("meta[name=token]");				
		if (toId) {
			var cmd = new Backbone.CQRS.Command({
					id:_.uniqueId('msg'),
					command: 'createAccountMsg',
					token: meta.attr("content"),
					payload: { 
					  id: toId ,
					  subject: subject,
					  text : desc,
					  type : type,
					  contentId : contentId
					}
			}); 
			cmd.emit(function(evt) {
				callback(evt);
			});
		}
	}
	
	exports.changeTitle = function(text) {
		$(document).prop('title', text + ' 兒童美術館' );
		//if (text == '') 
		//	$("#unreadMessageCount").hide();
	}
	
	exports.setTitleCounter = function(count) {
		if (count > 0) {
			$(document).prop('title', "(" + count + ")" + ' 兒童美術館' );
			
			var mq = window.matchMedia( "(min-width: 767px)" );
			if (mq.matches)
				$("#unreadMessageCount").text(count).show();
		} else {
			$(document).prop('title', '兒童美術館' );
			$("#unreadMessageCount").text(0);
		}
	}
	
	exports.incTitleCounter = function() {
		var title = $(document).prop('title');
		title = title.replace("兒童美術館","");
		title = title.replace(" ","");
		title = title.replace("(","");
		title = title.replace(")","");
		
		if (title == "") title = 0;
		var count = parseInt(title);
		count ++;		
		$(document).prop('title', "(" + count + ")" + ' 兒童美術館' );
		
		var mq = window.matchMedia( "(min-width: 767px)" );
		if (mq.matches)
			$("#unreadMessageCount").text(count).show();
	}
	
	exports.decTitleCounter = function() {
		var title = $(document).prop('title');
		title = title.replace("兒童美術館","");
		title = title.replace(" ","");
		title = title.replace("(","");
		title = title.replace(")","");
		
		if (title == "") title = 0;
		var count = parseInt(title);
		
		if (count > 0)
			count --;
		
		if (count > 0)
			$(document).prop('title', "(" + count + ")" + ' 兒童美術館' )
		else {			
			$(document).prop('title', ' 兒童美術館' );
			//$("#unreadMessageCount").hide();
		}
		
		$("#unreadMessageCount").text(count);
		
	}

	
	exports.formatTimeScale = function(msgTime) {
		var fomattedTimeMsg = '';
		//var time =  item.get("time");
		//var date = msgTime;
		var secNow = new Date().getTime() / 1000;
		var secMsg = new Date(msgTime).getTime() / 1000;
		//console.log('secNow:=' + secNow + ', secMsg:'+secMsg);
		var timediff = (secNow - secMsg)/60;
		//console.log('timediff:'+timediff);
		//var d1 = new Date("2014-02-02 13:54:04");
		//var d2 = new Date("2015-02-03 13:54:14");
		//var timediff = ((d2.getTime() / 1000) - (d1.getTime() / 1000))/60;

		if (timediff < 1) {
			//fomattedTimeMsg = '剛剛!';
			fomattedTimeMsg = kidart.i18n.t("utility.timeJust");
		} else if (timediff < 60) {
			//fomattedTimeMsg = Math.floor(timediff) + ' 分鐘前';
			fomattedTimeMsg = Math.floor(timediff) + kidart.i18n.t("utility.timeMins");
		} else if (timediff < 1440) {
			//fomattedTimeMsg = Math.floor(timediff/60) + ' 小時前';
			fomattedTimeMsg = Math.floor(timediff/60) + kidart.i18n.t("utility.timeHours");
		} else if (timediff < 43200) {
			//fomattedTimeMsg = Math.floor(timediff/1440) + ' 天前';
			fomattedTimeMsg = Math.floor(timediff/1440) + kidart.i18n.t("utility.timeDays");
		} else if (timediff < 525600) {
			//fomattedTimeMsg = Math.floor(timediff/43200) + ' 個月前';
			fomattedTimeMsg = Math.floor(timediff/43200) + kidart.i18n.t("utility.timeMonths");
		} else {
			//fomattedTimeMsg = Math.floor(timediff/525600) + ' 年前';
			fomattedTimeMsg = Math.floor(timediff/525600) + kidart.i18n.t("utility.timeYears");
		}
		//var dd = date.getDate();
		//var mm = date.getMonth()+1; 
		//var yyyy = date.getFullYear();
		//var h= date.getHours();
		//var m= date.getMinutes();
		
		//var fomattedTimeMsg = '哇哈哈!!! ' + timediff + ' - ' + fomattedTimeMsg;
		//var fomattedTimeMsg = fomattedTimeMsg + '[' + timediff + ']';
		//var fomattedTimeMsg = fomattedTimeMsg + '[' + timediff + ']';
		return fomattedTimeMsg;
	}
	
	exports.delStorage = function(key,json,type){
		if (type == 'local')
			window.localStorage.removeItem(key);
		else
			window.sessionStorage.removeItem(key);
	}
	
	exports.addStorage = function(key,json,type){
		var data = "";
		if (type == 'local')
			data = window.localStorage[key]
		else
			data = window.sessionStorage[key];
		
		var dataobj = [];
		if (data) 
			dataobj = data.split(',');
		dataobj.push(encodeURIComponent(JSON.stringify(json)));
		
		if (type == 'local')
			window.localStorage[key] = dataobj.toString()
		else
			window.sessionStorage[key] = dataobj.toString(); 
	}
	
	exports.loadStorage = function(key,type){
		var data = '';
		
		if (type == 'local')
			data = window.localStorage[key]
		else
			data = window.sessionStorage[key];
		
		var dataobj = [];
		if (data) 
			dataobj = data.split(',');
		
		for (var i = 0; i < dataobj.length ; i++) {
			dataobj[i] = JSON.parse(decodeURIComponent(dataobj[i]));
		}		
		return dataobj;
	}
	
	//exports.getServerEnvironmentVariable= function(key){
	//	return process.env[key];
	//}
	exports.getDefaultProfileImage = function(key,type) {
		var profileimage = ["/images/user/profileimg/profileimage_1.jpg", "/images/user/profileimg/profileimage_2.jpg", "/images/user/profileimg/profileimage_3.jpg", "/images/user/profileimg/profileimage_4.jpg","/images/user/profileimg/profileimage_5.jpg","/images/user/profileimg/profileimage_6.jpg"]
		return profileimage[Math.floor((Math.random() * profileimage.length))];
	}
	
})(typeof exports === 'undefined' ? this['utility']={} : exports);