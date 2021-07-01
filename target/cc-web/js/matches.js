$( document ).ready(function() {
	$("body").on('click', '.couple_chat_minimized', function(e) {
		var chat = $(this).parent();
		var max = $(chat).find(".couple_chat_maximized");
		var min = $(chat).find(".couple_chat_minimized");
		
		if($(max).is(":visible")) {
			$(max).hide();
		} else {
			$(max).show();
		}
	});
	
//	$(".couple_match_send_message").click(function(e){
//		
//		$.ajax({
//		    type: "GET",
//		    url: "/cc-web/chat_view?roomid="+this.getAttribute("data-roomid")+"&userid="+this.getAttribute("data-userId"),
//		    success: function (response_view) { 
//		    	$(".couple_matches_chat_container").append(response_view);
//		    }
//		});
//	});
	
	$(".couple_match_send_message").click(function(e){
		e.preventDefault();
		let _this_button = this;
		if (this.classList.contains("chatoff")){
			return false;
		} else {
			this.classList.add("chatoff");
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
		$.ajax({
		    type: "POST",
		    url: "/cc-web/chat_view",
            data: JSON.stringify(chatRoomInfo),
		    success: function (chatRoomNode) { 
		    	$(".couple_matches_chat_container").append(chatRoomNode);
		    	$(document).trigger("load_chat_box", {
		    		"roomId": roomId
		    	});
		    },
		    error: function(xhr, ajaxOptions, thrownError){
		    	_this_button.classList.remove("chatoff");
		    	console.log(xhr);
		    	console.log(ajaxOptions);
		    	console.log(thrownError);
		    }
		});
	});
});