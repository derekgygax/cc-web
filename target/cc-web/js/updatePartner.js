"use strict";
let UPDATE_PARTNER = {
	update: function(buttonClicked){
		let partner = Object.create(Partner);
		let partnerId = document.getElementById("updatePartnerForm").getAttribute("data-partnerid");
		let formElements = document.getElementById("updatePartnerForm").elements;
		for (let i = 0; i < formElements.length; i++){
			let element = formElements[i];
			if (element.name){
				partner[element.name] = element.value;
			}
		}

		//Ensure all the input is ready for processing
		//TODO make this work again
		/*let failedFields = partner.checkInputFields("update");
		if (failedFields.length > 0){
			for (let iF=0; iF < failedFields.length; iF++){
				document.getElementById(failedFields[iF]).classList.add("failedField");
			}
			alert("The highlighted fields contain errors");
			return false;
		}*/
		
		var updateResponse = function(updateRequestStatus, updatedDisplayNode){
			if (updateRequestStatus == 401){
				window.location.href = CONFIGURATION.WEBPAGES.FAIL_AUTHORIZATION;
			} else if (updateRequestStatus == 200){
				UPDATE_PARTNER.saved(buttonClicked);
			} else {
//				TODO
//				WHAT TO DO HERE
				alert("ERROR!!!");
			}
		}
		
		partner.updateInfo(updateResponse);
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


$(document).ready(function() {
	
	$("#age").on('input', function(){
		if (!Validity.isAgeValid(this.value)){
			$("#failAge").show();
		} else{
			$("#failAge").hide();
		}
	});
	
	$("#phoneNumber").on('click', function(){
		if (this.value == CONFIGURATION.DEFAULTS["phoneNumber"]){
			this.value = "";
		}
	});
	$("#phoneNumber").on('input', function(){
		//Is this right? Do you need this here!!!
		if (this.value == CONFIGURATION.DEFAULTS["phoneNumber"]){
			return false;
		}
//		TODO
//		UNCOMMENT IN FUTURE WHEN READY!!!
//		NEED TO WRITE THIS!!
//		CAN"T JUST USE THE CHECK YOU DO IN PARTNER!!!" +
//		Because the value is not what is in the object!!
//		if (){
//			$("#failPhoneNumber").show();
//		} else {
//			$("#failPhoneNumber").hide();
//		}
	});
	
	$("#zipcode").on('input', function(){
		if (!Validity.isZipcodeValid(this.value)){
			$("#failZipcode").show();
		} else {
			$("#failZipcode").hide();
		}
	});
	
	$("body").on('click', "#updatePartnerForm button", function(e){
		e.preventDefault();
		var age = $("#updatePartnerAge").val();
		var firstName = $(".updatePartnerfirstName");
		var firstNameHelper = $(firstName).siblings(".helper-text");
		var lastName = $(".updatePartnerlastName");
		var lastNameHelper = $(lastName).siblings(".helper-text");
		
		/* Age Validation */
		if(age) {
			if(isNaN(parseInt(age))) {
				console.log("NOT NUMBER");
				$("#updatePartnerForm input[name='age']").addClass("invalid");
				$("#updatePartnerForm input[name='age']").siblings(".helper-text").attr('data-error', 'Age must be a number');
				return;
			} else {
				age = parseInt(age);
			}
			if(age > 125) {
				$("#updatePartnerForm input[name='age']").addClass("invalid");
				$("#updatePartnerForm input[name='age']").siblings(".helper-text").attr('data-error', 'Please enter a realistic age');
				return;
			}
			if(age < 18) {
				$("#updatePartnerForm input[name='age']").addClass("invalid");
				$("#updatePartnerForm input[name='age']").siblings(".helper-text").attr('data-error', 'You must be 18 years old or older');
				return;
			}
			$("#updatePartnerAge").removeClass("invalid");
		}
		/* Name Validation */
		var nameErrors = 0;
		if($(firstName).length && !firstName.val()) {
			$(firstName).addClass("invalid");
			$(firstNameHelper).attr('data-error', 'You must provide a first name');
			nameErrors++;
		} else {
			$(firstName).removeClass("invalid");
		}
		if($(lastName).length && !lastName.val()) {
			$(lastName).addClass("invalid");
			$(lastNameHelper).attr('data-error', 'You must provide a last name');
			nameErrors++;
		} else {
			$(lastName).removeClass("invalid");
		}
		if(nameErrors > 0) {
			return;
		}
		
		/* Finally Submit form */
		UPDATE_PARTNER.update($(this));
	});
	
	$("body").on("focusout", "#update_partner_modal", function(e){
		console.log("it started");
	});
	
});
