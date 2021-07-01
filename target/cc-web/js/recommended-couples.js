"use strict";

/* Recommended Desktop Search  */
$("body").on("click", "", function() {
	
});

// hide all but the initial recommeneded couple for mobile
// then loop through the parent div and remove as we successfully get rid
// if it wasnt successfully removed, we append it to the end so they get to try again
$('#recommendedSingle .recommended_couple_card:not(:first)').hide();


function fetchInput(identifier) {
    var form_data = identifier.serialize().split('&');
    var input     = {};
    var params = {};
    
    $.each(form_data, function(key, value) {
    	var data = value.split("=");
    	var paramId = data[0];
    	var paramValue = data[1];
    	
    	if(params[paramId]) {
    		var exists = params[paramId];
    		params[paramId] = exists + "," + paramValue;
    	} else {
    		params[paramId] = paramValue;
    		console.log(paramId);
    	}

    });

    return input;
}

$("body").on("change", "#searchForm", function(e) {
	
	var data = fetchInput($("#searchForm"));
	data.template = "search_template.twig.html";
	
	var processSearch = function(resultCouplesNode){
		console.log(resultCouplesNode)
	};
	var partner = Object.create(Partner);
	partner.search(data, processSearch);
	
	console.log("Hey!");
});


/* .marco, .polo, .waldo 
 *  	are a quick hack for transitioning from a 
 *  	3 column layout to a 1 column layout for recommended couples
 */
$(".polo").hide();

$("body").on("click", ".recommended_couple_header, .recommended_couple_info", function(){
	// If the user is clicking on Approve or Decline this don't retrieve the detail card
	if (document.activeElement.classList.contains("recommended_approve")){
		return false;
	}
	if (document.activeElement.classList.contains("couple_vert_menu")){
		return false;
	}
	var isDropdownActive = $(this).parent().find(".dropdown-content").css('opacity');
	if(isDropdownActive == 1) {
		return false;
	}
	console.log($(this).parent().find(".dropdown-content"));
	let couple = Object.create(Couple);
	couple.coupleId = this.parentElement.getAttribute("data-coupleid");
	
	// Total f*kin hack, but it saves 200+ lines of code
	window.location.href = "/cc-web/profile?couple="+couple.coupleId;
	
	/*
	 * 	$(".marco").removeClass("l12");
	$(".marco").addClass("l4");
	$(".waldo").removeClass("l4");
	$(".waldo").addClass("l12");
	$(".polo").show();
	 * let addDetailedCouple = function(detailedCoupleHTML){
		let detailedCoupleNode = document.getElementById("recommendedDetailed");
		detailedCoupleNode.setAttribute("data-coupleid", couple.coupleId);
		detailedCoupleNode.innerHTML = detailedCoupleHTML;
		$('body').find('.tabs').tabs();
	};
	couple.getDetailCard(addDetailedCouple);*/
});

$("body").on("click", "#recommendedSingle .recommended_approve", function(e) {
	e.preventDefault();
	e.stopImmediatePropagation();

	var card = $(this).closest(".recommended_couple_card");
	var nextCoupleCard = $(card).next();
	var priorCoupleCard = $(card).prev();

	if(!nextCoupleCard.hasClass(".recommended_couple_card")) {
		$(nextCoupleCard).removeClass('hidden');
	}
	
	let couple = Object.create(Couple);
	let $recommendedCoupleCard = $("#recommendedSingle").find(".recommended_couple_card");
	couple.coupleId = $recommendedCoupleCard.attr("data-coupleid");
	var datavalue = $(e.target).closest('a').attr('data-value');
	couple.approveProfile({"approve": datavalue}, function(res){console.log(res)});

	$(card).fadeOut(750, function() {
			$(card).remove();
			$(nextCoupleCard).fadeIn();
	});
	
});


/* VERY IMPORTANT: HIDES ERROR MSG IF NO CHILDREN */
$(".tabs li a").each(function() {
	var tabId = $(this).attr("href");
	var tab = $(tabId);
	var childrenLeft = $(tab).children().length - 1;
	if(childrenLeft === 0) {
		console.log(tabId+ " has no more children left");
		$(tabId+" .no-more-couples-view-global").css("display", "table");
	} else {
		console.log(tabId+ " has "+childrenLeft+" children left");
		$(tabId+" .no-more-couples-view-global").css("display", "none");
	}
});

$("body").on("click", ".recommended_approve", function(e){
	e.preventDefault();
	let $recommendedCoupleCard = $(this).closest(".recommended_couple_card");
	let $parent = $recommendedCoupleCard.parent();
	let responseFn = function(approveResult){
		approveResult = JSON.parse(approveResult);
		let approveStatus = approveResult["coupleApprove"];
		switch (approveStatus){
			case CONFIGURATION.APPROVE_STATUS.APPROVED:
				alert("You and your partner both approve of this couple.");
				break;
			case CONFIGURATION.APPROVE_STATUS.DECLINED:
				alert("Both you and your partner do not approve of this couple. " +
						"Don't worry, you won't see them again.");
				break;
			case CONFIGURATION.APPROVE_STATUS.MIXED:
				var wordsForTheMix = null;
				if (approveResult.approve){
					wordsForTheMix = "does not approve";
				} else {
					wordsForTheMix = "approves";
				}
				alert("Your partner "+wordsForTheMix+" of this couple. You will still be able to see this couple " +
				"and perhaps in the future you will agree.");
				break;
			case CONFIGURATION.APPROVE_STATUS.ONE_YES: case CONFIGURATION.APPROVE_STATUS.ONE_NO:
				alert("Your partner has not responded to this couple.");
				break;
		}
		$recommendedCoupleCard.parent().remove();
	};
	
	let couple = Object.create(Couple);
	couple.coupleId = $recommendedCoupleCard.attr("data-coupleid");
	var datavalue = $(e.target).closest('a').attr('data-value');
	//couple.approveProfile({"approve": this.getAttribute("data-value")}, responseFn);
	var nextRecommenedCouple = $("#nextRecommenedCouple").attr('data-coupleid');
	if($recommendedCoupleCard.hasClass("away-couple-actions")) {
		if(nextRecommenedCouple) {
			console.log("Redirecting to Couple Profile: /cc-web/profile?couple="+nextRecommenedCouple);
			window.location.href="/cc-web/profile?couple="+nextRecommenedCouple;
			couple.approveProfile({"approve": datavalue}, function(res){console.log(res)});
		} else {
			couple.approveProfile({"approve": datavalue}, function(res){console.log(res)});
			window.location.href="/cc-web/recommended_couples";
		}

	} else {
		console.log("Approved");

		var tab = $parent.parent().attr('id');
		var el = $('<div class="waldo col s12 m12 l4">'+$($recommendedCoupleCard).prop('outerHTML')+'</div>');
		var partnerApprove = $recommendedCoupleCard.find("#recommendedPartnerApprove").attr('data-partnerApprove');
		var coupleId = $recommendedCoupleCard.attr('data-coupleid');
		if($("#allCouples").find('#no-more-couples-view').length == 1) {
			$("#no-more-couples-view").hide();
		}

		/* Recommended Tab Sorter for Desktop / Tablets */
		/* Basically move the card to the right Tab after we preform an action on it */
		/* make sure to change the text and data-value's to prevent weirdness */
		/* holy cow that was alot of logic cases fuck */
		if(tab == 'allCouples') {

			if(datavalue == 'approve') {
				var duplicate = $("#partnerApprovedCouples").find(".recommended_couple_card[data-coupleid='"+coupleId+"']");
				$(duplicate).parent().remove();
				$("#approvedCouples").append(el);
				var unApproveBtn = $(el).find(".recommended_approve[data-value='approve']");
				$(unApproveBtn).attr('data-value', 'none');
				$(unApproveBtn).text('Unapprove');
			}
			if(datavalue == 'decline') {
				var duplicate = $("#partnerApprovedCouples").find(".recommended_couple_card[data-coupleid='"+coupleId+"']");
				$(duplicate).parent().remove();
				$("#declinedCouples").append(el);
				var resetBtn = $(el).find(".recommended_approve[data-value='decline']");
				$(resetBtn).attr('data-value', 'none');
				$(resetBtn).text('Reset');
			}
		}
		if(tab == 'approvedCouples') {
			if(datavalue == 'none') {
				if(partnerApprove == 'approve') {
					var ele = $('<div class="waldo col s12 m12 l4">'+$($recommendedCoupleCard).prop('outerHTML')+'</div>');
					$("#partnerApprovedCouples").append(ele);
					var ApproveBtn = $(ele).find(".recommended_approve[data-value='none']");
					$(ApproveBtn).attr('data-value', 'approve');
					$(ApproveBtn).text('Approve');

				}
				$("#allCouples").append(el);

				var ApproveBtn = $(el).find(".recommended_approve[data-value='none']");
				$(ApproveBtn).attr('data-value', 'approve');
				$(ApproveBtn).text('Approve');
			}
			
			if(datavalue == 'decline') {
				$("#declinedCouples").append(el);

				var ApproveBtn = $(el).find(".recommended_approve[data-value='none']");
				$(ApproveBtn).attr('data-value', 'approve');
				$(ApproveBtn).text('Approve');
				
				var resetBtn = $(el).find(".recommended_approve[data-value='decline']");
				$(resetBtn).attr('data-value', 'none');
				$(resetBtn).text('Reset');
			}
		}
		if(tab == 'partnerApprovedCouples') {
			if(datavalue == 'approve') {
				var duplicate = $("#allCouples").find(".recommended_couple_card[data-coupleid='"+coupleId+"']");
				$(duplicate).parent().remove();
				$("#approvedCouples").append(el);
				var unApproveBtn = $(el).find(".recommended_approve[data-value='approve']");
				$(unApproveBtn).attr('data-value', 'none');
				$(unApproveBtn).text('Unapprove');
			}
			if(datavalue == 'decline') {
				var duplicate = $("#allCouples").find(".recommended_couple_card[data-coupleid='"+coupleId+"']");
				$(duplicate).parent().remove();
				var duplicate = $("#declinedCouples").find(".recommended_couple_card[data-coupleid='"+coupleId+"']");
				$(duplicate).parent().remove();
				$("#declinedCouples").append(el);
				var resetBtn = $(el).find(".recommended_approve[data-value='decline']");
				$(resetBtn).attr('data-value', 'none');
				$(resetBtn).text('Reset');
			}
		}
		if(tab == 'declinedCouples') {
			if(datavalue == 'approve') {
				var duplicate = $("#partnerApprovedCouples").find(".recommended_couple_card[data-coupleid='"+coupleId+"']");
				$(duplicate).parent().remove();
				$("#approvedCouples").append(el);
				
				var declineBtn = $(el).find(".recommended_approve[data-value='none']");
				$(declineBtn).attr('data-value', 'decline');
				$(declineBtn).text('Decline');
				
				var unApproveBtn = $(el).find(".recommended_approve[data-value='approve']");
				$(unApproveBtn).attr('data-value', 'none');
				$(unApproveBtn).text('Unapprove');

			}
			if(datavalue == 'none') {
				if(partnerApprove == 'approve') {
					var ele = $('<div class="waldo col s12 m12 l4">'+$($recommendedCoupleCard).prop('outerHTML')+'</div>');
					$("#partnerApprovedCouples").append(ele);
					var ApproveBtn = $(ele).find(".recommended_approve[data-value='none']");
					$(ApproveBtn).attr('data-value', 'decline');
					$(ApproveBtn).text('Decline');

				}
				$("#allCouples").append(el);
				var ApproveBtn = $(el).find(".recommended_approve[data-value='none']");
				$(ApproveBtn).attr('data-value', 'decline');
				$(ApproveBtn).text('Decline');
			}
		}
		
		$parent.fadeOut(1000, function() { 
			$(this).remove();
			
			$(".tabs li a").each(function() {
				var tabId = $(this).attr("href");
				var tab = $(tabId);
				var childrenLeft = $(tab).children().length - 1;
				if(childrenLeft === 0) {
					$(tabId+" .no-more-couples-view-global").css("display", "table");
				} else {
					$(tabId+" .no-more-couples-view-global").css("display", "none");
				}
			});

		});
		
		// we're about to match omg :blush:
		if(partnerApprove == 'approve' && datavalue == 'approve') {
			var homeCoupleId = $("#newMatchModal").find('input[name="homeCoupleId"]').val();
			var awayCoupleId = $recommendedCoupleCard.attr('data-coupleid');
			
			var higherPartnerId = $recommendedCoupleCard.attr('data-higherPartnerId');
			var lowerPartnerId = $recommendedCoupleCard.attr('data-lowerPartnerId');
			
			var higherPartnerFirstName = $recommendedCoupleCard.attr('data-higherPartnerFirstName');
			var lowerPartnerFirstName = $recommendedCoupleCard.attr('data-lowerPartnerFirstName');
			
			var futureRoomId = homeCoupleId+"-"+awayCoupleId;
			
			$('#newMatchModal').modal('open'); 
			$('#newMatchModal').find('input[name="roomid"]').attr('value', futureRoomId);
			$('#newMatchModal').find('input[name="awayCoupleId"]').attr('value', awayCoupleId);
			$('#newMatchModal').find('input[name="higherPartnerId"]').attr('value', higherPartnerId);
			$('#newMatchModal').find('input[name="lowerPartnerId"]').attr('value', lowerPartnerId);
			$('#newMatchModal').find('input[name="higherPartnerFirstName"]').attr('value', higherPartnerFirstName);
			$('#newMatchModal').find('input[name="lowerPartnerFirstName"]').attr('value', lowerPartnerFirstName);
		}
		
		couple.approveProfile({"approve": datavalue}, function(res){console.log(res)});

	}

});

//ccChatSend:
$('body').on('submit', '.sendFutureMessageForm', function(e){
	e.preventDefault();
	let roomId = this.elements["roomid"].value;
	let message = this.elements["message"].value.trim();
	let homeCoupleId = this.elements["homeCoupleId"].value;
	let awayCoupleId = this.elements["awayCoupleId"].value;
	
	let homePartnerFirstName = this.elements["homePartnerFirstName"].value;
	let awayPartnerFirstName = this.elements["homePartnerFirstName"].value;
	let homePartnerId = this.elements["homePartnerId"].value;
	let awayPartnerId = this.elements["awayPartnerId"].value;

	let higherPartnerFirstName = this.elements["higherPartnerFirstName"].value;
	let lowerPartnerFirstName = this.elements["lowerPartnerFirstName"].value;
	let higherPartnerId = this.elements["higherPartnerId"].value;
	let lowerPartnerId = this.elements["lowerPartnerId"].value;

	
	var homeCouple = homeCoupleId.split("-");
	var partners = awayCoupleId.split("-");
	
	var homePartner = {
		'id': homePartnerId,
		'firstName': homePartnerFirstName,
	}
	
	var awayPartner = {
		'id': awayPartnerId,
		'firstName': awayPartnerFirstName
	}
	
	var higherPartner = {
			'partnerIdHigher': higherPartnerId,
			'firstName': higherPartnerFirstName
	}
	
	var lowerPartner = {
			'partnerIdLower': lowerPartnerId,
			'firstName': lowerPartnerFirstName
	}
	
	
	
	var newSocket = {
			'match': {
				'matchId': roomId,
				'awayCoupleId': awayCoupleId,
				'couple': { 
					'partnerIdHigher': higherPartnerId,
					'partnerIdLower': lowerPartnerId,
					'partners': { } 
					}
				
			}
	}
	
	
	newSocket.match.couple.partners[higherPartnerId] = higherPartner;
	newSocket.match.couple.partners[lowerPartnerId] = lowerPartner;

	
	$(document).trigger("send_future_chat_message", {
		"match": newSocket,
		"homePartner": homePartner,
		"awayPartner": awayPartner,
		"roomId": roomId,
		"message": message
	});
	
	console.log("Message sent: "+message);
	
	// Clear input field for next message:
	this.elements["message"].value = "";
	return false;
});