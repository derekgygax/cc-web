"use strict";
(function(){
	// Hold the group of all the individual sockets
	let GroupOfSockets = {
		setup: function(homePartner, awayPartner, CHAT_URL){
			this.sockets = {};
			this.CHAT_URL = CHAT_URL;
			this.homePartner = homePartner;
			this.awayPartner = awayPartner;
		},
		
		openSockets: function(matches, urlPath){
			let _this = this;
			// Change the display names for the homeCouple if need be
			this.configureDisplayNames(this.homePartner, this.awayPartner);
			let makeSocketConnection = function(match){
				let socket = null;
				// this is really bad, this should be parallel regardless of url path. 
				if (urlPath == CONFIGURATION.WEBPAGES.MATCHES || urlPath == CONFIGURATION.WEBPAGES.CHAT){
					socket = Object.create(ChatSocket);
					// Change the display names for the awayCouples if you are opening a ChatSocket
					_this.configureMatchDisplayName(match);
				} else {
					socket = Object.create(NotificationSocket);
				}

				socket.setup(match, _this.homePartner, _this.awayPartner, _this.CHAT_URL);
				_this.sockets[match.matchId] = socket;
				
			};
			
			// This makes them all asynchronous and run at the same time
			for (var i=0; i < matches.length; i++){
				setTimeout(makeSocketConnection(matches[i]), 0);
			}
		},
	
		addChatSocket: function(match){
			this.configureMatchDisplayName(match);
			let socket = Object.create(ChatSocket);
			socket.setup(match, this.homePartner, this.awayPartner, this.CHAT_URL);
			this.sockets[match.matchId] = socket;
		},
		
		configureMatchDisplayName: function(match){
			// If both users don't have a verified email then display both names
			// rather than one name
			let matchPartnerIds = Object.keys(match.couple.partners);
			let matchPartnerOne = match.couple.partners[matchPartnerIds[0]];
			let matchPartnerTwo = match.couple.partners[matchPartnerIds[1]];
			this.configureDisplayNames(matchPartnerOne, matchPartnerTwo);
		},
		
		configureDisplayNames: function(partnerOne, partnerTwo){
			if (partnerOne.verifiedEmail != 1 || partnerTwo.verifiedEmail != 1){
				partnerOne.firstName = partnerOne.firstName + " & " + partnerTwo.firstName;
				partnerTwo.firstName = partnerOne.firstName;
			}			
		}
	};
	
	// Control a single socket
	let NotificationSocket = {
		setup: function(match, homePartner, awayPartner, CHAT_URL){
			this.roomId = match.matchId;
			this.homePartnerId = homePartner.id;
			this.CHAT_URL = CHAT_URL;
			this.establishSocket();
		},
		
		establishSocket: function(){
			let _this = this;
			let loadedInitialFromDB = false;
			let connection = io(
					this.CHAT_URL,
					{
						path: '/socket.io',
						query: {
							"roomid": this.roomId,
							"userid": this.homePartnerId,
							"last": 0
						}
					}
			);
			
			this.connection = connection;
			
			connection.on('connect', function(){
				
			});
			
			// receiving a single message:
			connection.on('msgRecv', function(){
				_this.alertYouGotNewMessages();
			});
			
			connection.on("msgGroup", function(groupOfMsgs){
				if (loadedInitialFromDB){
					_this.alertYouGotNewMessages();
				} else {
					loadedInitialFromDB = true;
				}
			});
			
			connection.on("welcome", function(info){
				let lastRead = Number(info["lastReadMsgId"]);
				let mostRecent = Number(info["latestMsgId"]);
				if (lastRead < mostRecent){
					_this.alertYouGotNewMessages();
				}
			});
		},
		
		alertYouGotNewMessages: function(){
			let $messageNavNode = $("#message_nav");
			$messageNavNode.css("background-color", "red");
			console.log("you got a message");			
		},
		
		close_connection: function(){
			this.connection.disconnect();
		}
		
	};
	
	let ChatSocket = {
//			RIGHT NOW THIS SAVES ALL THE MESSAGES FOR AN INDIVIDUAL ON A PAGE!!
//			THIS IS NOT THE BEST FOR MEMORY BUT I AM TIRED AND THIS IS GOOD ENOUGH FOR NOW
//			this.messages_saved
			
			
		numberOldMsgsRetrieving: 30,
			
		setup: function(match, homePartner, awayPartner, CHAT_URL){
			this.CHAT_URL = CHAT_URL;
			this.firstGroupAlreadySaved = false;
			this.loadedChatBox = false;
			
			this.messages_saved = [];
			
			this.roomId = match.matchId;
			this.awayCoupleId = match.awayCoupleId;
			this.homePartnerId = homePartner.id;
			this.awayPartnerId = awayPartner.id;
			
			if(!this.roomId) {
				this.roomId = this.awayPartnerId+"-" + this.homePartnerId + "-"+this.awayCoupleId;
			}
			this.users = {};
			this.users[homePartner.id] = {
					"class": "chatHomeCouple chatHomePartner",
					"name": homePartner.firstName,					
			};
			this.users[awayPartner.id] = {
					"class": "chatHomeCouple chatAwayPartner",
					"name": awayPartner.firstName,					
			};
			let awayCouple = match.couple;
			let awayCoupleHigherPartner = awayCouple['partners'][awayCouple['partnerIdHigher']];
			let awayCoupleLowerPartner = awayCouple['partners'][awayCouple['partnerIdLower']];
			this.users[awayCoupleHigherPartner.partnerId] = {
					"class": "chatAwayCouple chatHigherPartner",
					"name": awayCoupleHigherPartner.firstName,					
			};
			this.users[awayCoupleLowerPartner.partnerId] = {
					"class": "chatAwayCouple chatLowerPartner",
					"name": awayCoupleLowerPartner.firstName,					
			};
			this.establishSocket();
		},
			
		buildMessageDiv: function(msg, user){
			// Top level div
			let div = CommonFunctions.getEl("div");
			div.setAttribute("data-msgid", msg.msgId);
			div.className = "message " + user['class'];
			
			// Div for username and timestamp
			let metaDiv = CommonFunctions.getEl("div");
			metaDiv.className = "chat_info";
			// Username
			let usernameNode = CommonFunctions.getEl("div");
			usernameNode.className = "chat_username";
			usernameNode.innerText = user['name'];
			
			// Add timestamp
			let dateNode = CommonFunctions.getEl("time");
			dateNode.className = "chat_date";
			dateNode.setAttribute("datetime", msg.dtg);
			$(dateNode).datetime();
			
			CommonFunctions.addEl(metaDiv, usernameNode);
			CommonFunctions.addEl(metaDiv, dateNode);
			
			// Message content
			let msgNode = CommonFunctions.getEl("div");
			msgNode.className = "chat_message";
			msgNode.innerText = msg.content;
			
			// Add the divs in the right order
			CommonFunctions.addEl(div, metaDiv);
			CommonFunctions.addEl(div, msgNode);
			
			return div;
		},
		
		putMessageInChat: function($chatNode, msgNode, idNumber){
			let addedMsg = false;
			let msgUsr = $(msgNode).find(".chat_username").text();
			
			$chatNode.find(".message").each(function(){
				if (Number(idNumber) < Number(this.getAttribute("data-msgid"))){
					$(msgNode).insertBefore(this);
					var thisUsr = $(this).find(".chat_username").text();
					if(msgUsr == thisUsr) {
						$(this).find(".chat_info").hide();
						$(this).find(".chat_message").addClass('chat-margin');
					}
					addedMsg = true;
					return false;
				}
			});
			if (!addedMsg){
				if ($chatNode.find(".message").length > 0){
					let lastMsgNumber = Number(idNumber) - 1;
					let lastmsgUser = $(".message[data-msgid="+lastMsgNumber+"]").find(".chat_username").text();
					if (lastmsgUser == msgUsr){
						$(msgNode).find(".chat_info").hide();
						$(msgNode).find(".chat_message").addClass('chat-margin');					
					}
				}
				$chatNode.append(msgNode);
			}
		},
		
		establishSocket: function(){
			
			let _this = this;
			
			// Define socket
			let connection = io(
				this.CHAT_URL,
				{
					path: '/socket.io',
					query: {
						"roomid": this.roomId,
						"userid": this.homePartnerId,
					}
				}
			);
			
			this.connection = connection;
			
			connection.on('connect', function(){

			});
			
			// ccChatRcv:
			connection.on('msgRecv', function(singleMsgInfo){
				let $chatRoom = $('#messages-'+_this.roomId);
				// Always saving the messages in the messages_saved thing
				_this.messages_saved.push(singleMsgInfo);
				// If the chat room isn't open yet then just report there was a message
				if ($chatRoom.length == 0){
					_this.announceNewMessages();
					return false;
				}
				let msgNode = _this.buildMessageDiv(singleMsgInfo, _this.users[singleMsgInfo.username]);
				_this.putMessageInChat($chatRoom, msgNode, msgNode.getAttribute("data-msgid"));
				$chatRoom.scrollTop($chatRoom[0].scrollHeight);
			});
			
			connection.on("msgGroup", function(groupOfMsgs){
				
				let $chatRoom = $('#messages-'+_this.roomId);
				if ($chatRoom.length == 0){
					// Add the messages to the saved things
					_this.messages_saved = _this.messages_saved.concat(groupOfMsgs);
					if (_this.firstGroupAlreadySaved){
						// Announce new messages have been added
						_this.announceNewMessages();
					} else {
						_this.firstGroupAlreadySaved = true;
					}
					return false;					
				} else {
					// If the chat box is open and you are getting a group back then that means the messages are older
					// meaning they should go first. So put them in the front
					// Even if you save them in the wrong order I think they will still be put in order correctly when the message is put in the box
					_this.messages_saved = groupOfMsgs.concat(_this.messages_saved);
				}
				let scrollHeightBefore = $chatRoom[0].scrollHeight;
				$.each(groupOfMsgs.reverse(), function(){
					let msgNode = _this.buildMessageDiv(this, _this.users[this.username]);
					_this.putMessageInChat($('#messages-'+_this.roomId), msgNode, msgNode.getAttribute("data-msgid"));
				});
				let scrollHeigthAfter = $chatRoom[0].scrollHeight;
				$chatRoom.scrollTop(Math.abs(scrollHeigthAfter - scrollHeightBefore));
			});
			
			connection.on("welcome", function(info){
				let lastRead = Number(info["lastReadMsgId"]);
				let mostRecent = Number(info["latestMsgId"]);
				if (lastRead < mostRecent){
					_this.announceNewMessages();
				}
			});
		},
		
		setLastReadMsg: function(){
			let $chat_box = $("#messages-"+this.roomId);
			if ($chat_box.length == 0){
				// If the chat box isn't open then don't change the last read message
				return false;
			}
			let $messages = $chat_box.find(".message");
			
			// or if there are no messages;
			if($messages.length == 0) {
				return false;
			}
			
			let mostRecentMsgId = $messages[$messages.length - 1].getAttribute("data-msgid");
			this.connection.emit(
				'setLastReadMsg',
				{
					"msgId": mostRecentMsgId
				}
			);
		},
		
		loadChatBox: function(){
			let _this = this;
			let $chatRoom = $('#messages-'+ this.roomId);
			// Somhow maybe this could happen
			if ($chatRoom.length == 0){
				return false;					
			}
			// If there are already messages in the chat room don't display
			// the initial introduce yourself message
			if (this.messages_saved.length > 0){
				let messageForm = $('#messages-'+ _this.roomId).closest(".sendMessageForm")[0];
				messageForm.elements['message'].setAttribute("placeHolder", '')
			}
			
			let scrollHeightBefore = $chatRoom[0].scrollHeight;
			$.each(this.messages_saved.reverse(), function(){
				let msgNode = _this.buildMessageDiv(this, _this.users[this.username]);
				_this.putMessageInChat($('#messages-'+ _this.roomId), msgNode, msgNode.getAttribute("data-msgid"));
			});
			let scrollHeigthAfter = $chatRoom[0].scrollHeight;;
			if (!this.loadedChatBox){
				$chatRoom.scrollTop($chatRoom[0].scrollHeight);
				this.loadedChatBox = true;
			} else {
				$chatRoom.scrollTop(Math.abs(scrollHeigthAfter - scrollHeightBefore));
			}
			
			this.setLastReadMsg();
			this.unAnnounceNewMessage();
		},
		
		unAnnounceNewMessage: function(){
			//$(".card[data-coupleid="+this.awayCoupleId+"]").css("border", "");			
			$(".collection-item[data-roomid='"+this.roomId+"']").css("border", "");
			$(".collection-item[data-roomid='"+this.roomId+"']").removeClass("notification_message");
			$(".collection-item[data-roomid='"+this.roomId+"']").find('p').text("Click to chat with this couple!");
		},
		
		announceNewMessages: function(){
			$(".collection-item[data-roomid='"+this.roomId+"']").prependTo(".chatCollection");
			//$(".card[data-coupleid="+this.awayCoupleId+"]").css("border", "5px solid red");
			$(".collection-item[data-roomid='"+this.roomId+"']").addClass("notification_message");
			$(".collection-item[data-roomid='"+this.roomId+"']").css("border-bottom", "2px solid green");
			$(".collection-item[data-roomid='"+this.roomId+"']").find('p').html("You have a new message from this couple!");
		},
		
		sendMessage: function(message){
			this.connection.emit(
				'msgSend',
				{
					'content': message
				}
			);			
			
		},
		
		retrieveSlice: function(start, stop){
			this.connection.emit(
				"slice",
				{
					"start": start,
					"stop": stop
				}
			);
		},
		
		close_connection: function(){
			this.setLastReadMsg();
			this.connection.disconnect();
		}
		
		
	};
	
	let closeAllSockets = function(){
		for (var roomId in GroupOfSockets.sockets){
			GroupOfSockets.sockets[roomId].close_connection();
			delete GroupOfSockets.sockets[roomId];
		}		
	};
	
	$(document).on("initiateChat", function(event, eventData){
		GroupOfSockets.setup(
			eventData.homePartner,
			eventData.awayPartner,
			eventData.CHAT_URL
		);
		if (eventData.matches){
			GroupOfSockets.openSockets(
				eventData.matches, 
				window.location.pathname
			);
		}

	});
	
	$(document).on("load_chat_box", function(event, eventData){

		if(GroupOfSockets.sockets[eventData.roomId]) {
			GroupOfSockets.sockets[eventData.roomId].loadChatBox();
		} else {
			console.log(eventData);
			console.log(GroupOfSockets.sockets[eventData.roomId]);
		}
	});
	
	$(document).on("send_chat_message", function(event, eventData){
		if (eventData.message){
			GroupOfSockets.sockets[eventData.roomId].sendMessage(eventData.message);
		}
	});
	
	// we have to create a socket
	
	$(document).on("send_future_chat_message", function(event, eventData){
		// Add this match to the sockets on the page
		if (!GroupOfSockets.hasOwnProperty(eventData.roomId)){
			GroupOfSockets.addChatSocket(eventData.match);
		}

		if (eventData.message){
			GroupOfSockets.sockets[eventData.roomId].sendMessage(eventData.message);
			console.log("Message sent to a future match");
		}
	});
	
	$(document).on("chat_slice", function(event, eventData){
		GroupOfSockets.sockets[eventData.roomId].retrieveSlice(
				eventData.startPos,
				eventData.stopPos
		);
	});
	
	$(document).on("set_last_read_msg", function(event, eventData){
		GroupOfSockets.sockets[eventData.roomId].setLastReadMsg();
	});

	$(window).on("beforeunload", function(){
		closeAllSockets();
	});
	
})();


