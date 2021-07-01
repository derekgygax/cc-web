"use strict";
let UPDATE_COUPLE = {
	update: function(buttonClicked){
		let couple = Object.create(Couple);
		let formElements = document.getElementById("updateCoupleForm").elements;
		for (let i = 0; i < formElements.length; i++){
			let element = formElements[i];
			if (element.name){
				couple[element.name] = element.value;
			}
		}

		//Ensure all the input is ready for processing
		//TODO make this work again
		// IS this going to be weird now!!!
//		let failedFields = couple.checkInputFields();
//		if (failedFields.length > 0){
//			for (let iF=0; iF < failedFields.length; iF++){
//				document.getElementById(failedFields[iF]).classList.add("failedField");
//			}
//			alert("The highlighted fields contain errors");
//			return false;
//		}
		
		
		let updatedResponseFn = function(updateResponseStatus, updateResponseText){
			if (updateResponseStatus == 200){
				console.log(updateResponseText);
				UPDATE_COUPLE.saved(buttonClicked);
			} else if (updateResponseStatus == 401){
				//Do something
//				window.location.href = CONFIGURATION.WEBPAGES.FAIL_AUTHORIZATION;
			} else {
//					TODO
//					WHAT TO DO HERE!!
			}
		};
		
		couple.updateInfo(updatedResponseFn);
	},
	
	populateCoupleWithData: function(couple){
		let formElements = document.getElementById("updateCoupleForm").elements;
		for (let i = 0; i < formElements.length; i++){
			let element = formElements[i];
			if (element.name){
				couple[element.name] = element.value;
			}
		}		
	},
	
	categoricalQuestionsForCouple: null,
	loadCouplePhoto: function(photo){
		
	},
	
	saved: function(button) {
		button.removeClass("light-blue");
		button.text("Saved");
		button.addClass("green");
		
		$(button).parent().find('input');
		
		setTimeout(function(){
			button.addClass("light-blue");
			button.text("Save");
			button.removeClass("green");
		}, 2000);
	}
};

$(document).ready(function(){
	//Save the current location
	// Take this away for now
	// Getting the location through JS takes forever
	// But Fogarty in his immense desires wants this taken away
	// because he wants the webiste to be slower and not function as well
	// forgive him world, for he knows not what he does
//	CommonFunctions.getCurrentLocation(function(location){
//		let newLocationNode = document.getElementById("new_current_location");
//		if (newLocationNode){
//			newLocationNode.value = location;
//		}
//	});
	
	
	$("#numChildren").on('input', function(){
		if(!Validity.isNumChildrenValid(this.value)){
			if (!this.value){
				// This is where you need to hide certain questions!!
				// The ones involving children!!
			} else {
				$("#failNumChildren").show();
			}
		} else {
			$("#failNumChildren").hide();
			if (this.value > 0){
				//This is where you show the questions concerning having children!!
			} else {
				// This is where you need to hide certain questions!!
				// The ones involving children!!
			}
		}
	});
	
	//Add a photo
	$("body").on("submit", ".uploadPhotoForm", function(e){
		e.preventDefault();
		for (let i=0; i < e.target.elements.length; i++){
			let r = e.target.elements[i];
			console.log(r.name);
			console.log(r.value);
			console.log("\n");
		}
		
//		let couple = Object.create(Couple);
////		var photoAddedResponse = function(){
//////			TODO
//////			IDK if you would do anything here
////		};
//		var photo = this.value;
//		couple.addPhoto({"photo": this.value}, photoAddedResponse);
	});
	
	
	$("body").on("click", "#updateLocation", function(){
		let updateLocationResponse = function(){
			console.log("dddd");
		};
		let changeCurrentLocationInForm = function(location){
			document.getElementById("updateCoupleForm").elements['location'].value = location;
		};
		let couple = Object.create(Couple);
		couple.updateLocation(
			document.getElementById("new_current_location").value,
			updateLocationResponse, 
			changeCurrentLocationInForm
		);
	});
	
//	$("body").on("click", ".editCoupleStory", function(){
//		let $textArea = $(this).parent().siblings(".card_content").find("textarea");
//		$textArea.attr('readonly', false);
//		$textArea.focus();
//	});
//	
//	$("body").on("blur", ".couplesStoryTextArea", function(){
//		if ($(this).attr("readonly")){
//			return false;
//		}
//		this.setAttribute("readonly", true);
//		// Save the new couples story
//		let couple = Object.create(Couple);
//		couple.story = this.value;
//		// TODO HOPEFULLY YOU CAN GET RID OF THIS LOCATION STUFF DOWN THE LINE
//		couple.location = this.getAttribute("data-location");
//		let updateStoryResponse = function(rStatus, rText){
//			if (rStatus == 200){
//				console.log(rStatus);
//				console.log(rText);
//			} else {
//				//Deal with a problem!!
//			}
//		};
//		couple.updateInfo(updateStoryResponse);
//	});
//	
	
	$("body").on("submit", "#updateCoupleForm", function(e){
		e.preventDefault();
		var btn = $(this).find("button:focus" );
		
		/* numChildren Validation */
		if($("#updateCouplenumChildren").length) {
		var numChildren = $("#updateCouplenumChildren").val();
		if(isNaN(parseInt(numChildren))) {
			console.log("NOT NUMBER");
			$("#updateCouplenumChildren").addClass("invalid");
			$("#updateCouplenumChildren").siblings(".helper-text").attr('data-error', 'Number of children must be a number');
			return;
		}
		if(numChildren > 10) {
			$("#updateCouplenumChildren").addClass("invalid");
			$("#updateCouplenumChildren").siblings(".helper-text").attr('data-error', 'Please enter a realistic number of children');
			return;
		}
		$("#updateCouplenumChildren").removeClass("invalid");
		}
		UPDATE_COUPLE.update(btn);
	});
	
});

