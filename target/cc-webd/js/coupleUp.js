"use strict";


$(document).ready(function() {
	
	$("body").on("submit", ".coupleUpForm", function(e){
		e.preventDefault();

		let formElements = e.target.elements;
		let coupleUpData = {};
		for (let i =0; i < formElements.length; i++){
			let element = formElements[i];
			if (element.name){
				coupleUpData[element.name] = element.value;
			}
		}
		if (coupleUpData.action == "send" && !coupleUpData.username){
			alert("Please enter your desired partner's username");
			return false;
		}
		
		let processResponse = function(rStatus, rText){
			if (rStatus == 200){
				if(coupleUpData.action == "send") {
					$(formElements['username']).addClass('valid');
					$(formElements['username']).siblings(".helper-text").attr('data-success', "User found!");
					updateCoupleUpHTML(e.target);
				} else if (coupleUpData.action == "accept"){
					//Stop sending to the update couple webpage!!!
					//Is this a good idea?????????//
					$("#approveCoupleUpBtn").removeClass("light-blue");
					$("#approveCoupleUpBtn").addClass("green");
					var path = location.pathname;
					if(path != "/cc-web/requirements") {
						window.location.replace(CONFIGURATION.WEBPAGES.PROFILE);
					}
				}
			} else if (rStatus == 400){
				if (JSON.parse(rText).code == 4){
					$(formElements['username']).addClass('invalid');
					$(formElements['username']).siblings(".helper-text").attr('data-error', "Sorry but that person is already in a couple");
				}
			} else {
				// TODO
				// Do something
				console.log(rStatus);
				$(formElements['username']).addClass('invalid');
				$(formElements['username']).siblings(".helper-text").attr('data-error', 'Could not find the username specified');
			}
		};
		
		let partner = Object.create(Partner);
		console.log(partner);
		partner.coupleRequestAction(coupleUpData, processResponse);
	});
	
	$("body").on("click", ".submitCoupleUp", function(e){
		$(this).parent().parent().find(".submitForm").val(this.value);
		$(this).closest(".coupleUpForm").submit();
		
		if(this.value == "accept") {
			
		} else {

		var button = $(this);
		var form = $(this).closest(".coupleUpForm");
		$(this).removeClass('light-blue');
		$(this).text('Declined');
		$(this).addClass('red darken-4');
		getNewRequestHTML(form);

		
		}
		/*var card_parent = $(this).closest(".coupleUpForm").parent().parent();
		if(card_parent) {
			var children = card_parent.children().length - 2;
			console.log(card_parent.children().length);
			
			if(children == 0) {
				var new_request = $('body').find(".new_request_handler");
				if(new_request.hasClass('s6')) {
					new_request.removeClass('s6');
					new_request.addClass('s12');
					card_parent.remove();
				}
			} else {
				$(this).closest(".coupleUpForm").remove();
			}
		}*/
		
		
	});
	
	function CoupleRequestFlow(button) {
		var card_parent = $(button).closest(".coupleUpForm").parent().parent();
		if(card_parent) {
			var children = card_parent.children().length - 2;
			console.log(card_parent.children().length);
			
			if(children == 0) {
				var new_request = $('body').find(".new_request_handler");
				if(new_request.hasClass('s6')) {

					card_parent.fadeOut("slow", function() {
						new_request.removeClass('s6');
						new_request.addClass('s12');
						$(button).closest(".coupleUpForm").parent().remove();
					});
				}
			} else {
				$(button).closest(".coupleUpForm").parent().remove();
			}
		}
	}
	
	$("body").on("click", ".revokeCoupleUp", function(e){
		var form = $(this).closest(".coupleUpForm");
		
		$.ajax({
		    type: "GET",
		    url: "/cc-web/couple_up?new_request",
		    success: function (response_view) { 
		    	let $parent = $(form).parent();
		    	$parent.hide();
		    	$parent.html(response_view);
		    	$parent.fadeIn("slow");
		    }
		});
	});
	
	function updateCoupleUpHTML(form) {
		$.ajax({
		    type: "GET",
		    url: "/cc-web/couple_up?request_to",
		    success: function (response_view) { 
		    	if(response_view) {
		    		let $parent = $(form).parent();
		    		$parent.html(response_view);

		    	}
		    }
		});
	}
	
	function getNewRequestHTML(form) {
		$.ajax({
		    type: "GET",
		    url: "/cc-web/couple_up?new_request",
		    success: function (response_view) { 
		    	if(response_view) {
		    		let $parent = $(form).parent();
		    		console.log($parent);
		    		$parent.html(response_view);

		    	}
		    }
		});
	}
});
