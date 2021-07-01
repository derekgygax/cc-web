"use strict";


// ccChatWebModule Client
$(document).ready(function(){
	// THIS SHOULD NOT BE HERE
	// IF SHOULD BE IN socket.js but for now who cares
	let numberOldMsgsRetrieving= 30;
		
	$("body").on("click", ".recommended_approve", function(e) {
		let couple = Object.create(Couple);
		let $recommendedCoupleCard = $(".chatContext").find(".recommended_couple_card");

		couple.coupleId = $recommendedCoupleCard.attr("data-coupleid");
		var datavalue = $(e.target).closest('a').attr('data-value');
		let approve = this.getAttribute('data-approve');
		let partnerapprove = this.getAttribute('data-partnerapprove');

		
	});
	$('body').on('click', '.chatCollection .collection-item', function(e) {
		e.preventDefault();
		let _this_button = this;
		if (this.classList.contains("chatoff")){
			//return false;
		} else {
			//this.classList.add("chatoff");
		}
		
		let approve = this.getAttribute('data-approve');
		let partnerapprove = this.getAttribute('data-partnerapprove');
		let awayCoupleId = this.getAttribute('data-awaycoupleid');
		let url = "/recommended_couples/couple?couple="+awayCoupleId;

		
		let roomId = this.getAttribute('data-roomid');
		let homePartnerId = document.getElementById("matchesList").getAttribute("data-homepartnerid");
		let awayPartnerId = document.getElementById("matchesList").getAttribute("data-awaypartnerid");
		let matchHigherId = this.getAttribute("data-matchhigherid");
		let matchLowerId = this.getAttribute("data-matchlowerid");
		let users = {};
		users[homePartnerId] = {
			"class": "chatHomeCouple chatHomePartner",
			"name": document.getElementById("matchesList").getAttribute("data-homepartnername"),
		};
		users[awayPartnerId] = {
			"class": "chatHomeCouple chatAwayPartner",
			"name": document.getElementById("matchesList").getAttribute("data-awaypartnername"),
		};
		users[matchHigherId] = {
			"class": "chatAwayCouple chatHigherPartner",
			"name": this.getAttribute("data-matchhighername"),
		};
		users[matchLowerId] = {
			"class": "chatAwayCouple chatLowerPartner",
			"name": this.getAttribute("data-matchlowername"),
		};
		
		let chatRoomInfo = {
				"roomId": roomId,
				"homePartnerId": homePartnerId,
				"matchHigherName": this.getAttribute("data-matchhighername"),
				"matchLowerName": this.getAttribute("data-matchlowername"),
		};
		$.ajax({
		    type: "POST",
		    url: "/chat_view/desktop",
            data: JSON.stringify(chatRoomInfo),
		    success: function (chatRoomNode) { 
		    	$(".chatContext").html(chatRoomNode);
		    	$(document).trigger("load_chat_box", {
		    		"roomId": roomId
		    	});
		    },
		    error: function(xhr, ajaxOptions, thrownError){
		    	//_this_button.classList.remove("chatoff");
		    	console.log(xhr);
		    	console.log(ajaxOptions);
		    	console.log(thrownError);
		    }
		});
	});
	$('.chatCollection .collection-item').first().trigger('click');

	$('body').on('getOldMsgs', ".message_box", function(event, eventData){
		let roomId = eventData["roomId"];
		let scrollPos = $(this).scrollTop();
		if (scrollPos == 0){
			let oldestInBox = Number($(this).find(".message")[0].getAttribute("data-msgid"));
			// If the oldest is the first message then don't do anything
			if (oldestInBox == 1){
				return false;
			}
			let oldestRetrieving = oldestInBox - numberOldMsgsRetrieving;
			if (oldestRetrieving <= 0){
				oldestRetrieving = 1;
			}
			
			$(document).trigger("chat_slice", {
				"roomId": roomId,
				"startPos": oldestRetrieving,
				"stopPos": oldestInBox
			});
			
		}
	});
	
	// ccChatSend:
	$('body').on('submit', '.sendMessageForm', function(){
		let roomId = this.elements["roomid"].value;
		let message = this.elements["message"].value.trim();
		
		$(document).trigger("send_chat_message", {
			"roomId": roomId,
			"message": message
		});
		
		// Clear input field for next message:
		this.elements["message"].value = "";
		return false;
	});
	
	$("body").on("click", ".close_chat_box", function(){
		let $chatBox = $(this).closest(".couple_chat");
		let roomId = $chatBox.data("roomid");
		
		$(document).trigger("set_last_read_msg", {
			"roomId": roomId
		});
		
		// Close the pop up that is that chat room
		$chatBox.remove();
		//Let a use click the start chat button again
		$(".couple_match_send_message[data-roomid="+roomId+"]").removeClass("chatoff");
	});
		
});
