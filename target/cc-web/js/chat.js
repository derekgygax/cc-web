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
		let url = "/cc-web/recommended_couples/couple?couple="+awayCoupleId;
		if(approve != "approve" || partnerapprove != "approve") {

			$(".chatContext").addClass("not_a_match");
			$.ajax({
			    type: "GET",
			    url: url,
			    success: function (coupleCard) { 
			    	$(".not_a_match").html(coupleCard);
			    	$(".not_a_match").find(".recommended_couple_card .card-action div").remove();
			    	$(".not_a_match").find(".recommended_couple_card .card-action").css("text-align", "center");
			    	$(".not_a_match").find(".recommended_couple_card .recommended_couple_info .left").remove();
			    	$(".not_a_match").find(".recommended_couple_card .recommended_couple_info .right").text("You and "+document.getElementById("matchesList").getAttribute("data-awaypartnername")+" must match with this couple to see their messages!");
			    	
			    	if(approve == "approve") {
			    		$(".not_a_match").find(".recommended_couple_card .card-action").append('<a class="btn recommended_approve light-blue" href="#" data-value="approve" disabled><span>Awaiting '+document.getElementById("matchesList").getAttribute("data-awaypartnername")+'\'s response</span></a>');
			    	} else {
			    		$(".not_a_match").find(".recommended_couple_card .card-action").append('<a class="btn recommended_approve light-blue" href="#" data-value="approve"><span>Match</span></a>');
			    	}
			    	
			    	
			    },
			    error: function(xhr, ajaxOptions, thrownError){
			    	//_this_button.classList.remove("chatoff");
			    	console.log(xhr);
			    	console.log(ajaxOptions);
			    	console.log(thrownError);
			    }
			});
			
			
			return;
		}
		
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
		console.log(chatRoomInfo);
		$.ajax({
		    type: "POST",
		    url: "/cc-web/chat_view/desktop",
            data: JSON.stringify(chatRoomInfo),
		    success: function (chatRoomNode) { 
		    	$(".chatContext").html($.parseHTML(chatRoomNode));
		    	$(".chatContext").find(".chat-content");
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

	$('body').on('getOldMsgs', ".message_box", function(){
		let roomId = $(this).closest(".couple_chat").attr("data-roomid");
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
				"stopPos": oldestInBox - 1
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
