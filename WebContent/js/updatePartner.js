"use strict";
let UPDATE_PARTNER = {
	update: function(buttonClicked){
		let partner = Object.create(Partner);
		let partnerId = document.getElementById("updatePartnerForm").getAttribute("data-partnerid");
		partner.partnerId = partnerId;
		let formElements = document.getElementById("updatePartnerForm").elements;
		for (let i = 0; i < formElements.length; i++){
			let element = formElements[i];
			if (element.name){
				if(element.name == 'password') {
					element.name = 'password_hash';
				}
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
				//TODO DO SOMETHING
			} else if (updateRequestStatus == 200){
				if(window.location.href.includes("login-select")) {
					window.location.replace("/login-select");
				} else {
					UPDATE_PARTNER.saved(buttonClicked);
				}
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
	},
	
};


$(document).ready(function() {
	
	$(".login-partner").click(function(e) {
		var homePartner = $(this).attr("data-homepartnerid");
		var awayPartner = $(this).attr("data-awaypartnerid");
		
		if (awayPartner != null ) {
			$.ajax({
				type: "POST",
				url: "/login-select",
				data: null,
				success: function (response) {
					// You have switched users so go to the profile page
					window.location.replace("/profile");
				},
				error: function(message) {
					console.log(message);
				}
			});
		}

		if (homePartner != null ) {
			// Just going back to where you already were
			// Doing nothing
			window.location.replace("/profile");
		}
		
	});
	
	$(".cancelLoginPartnerProfile").click(function(e) {
		$(".loginPartnerProfile:visible").fadeOut("fast", function() {
			$("#selectPartnerProfile").fadeIn();
		});
		e.preventDefault();
		e.stopPropagation();
	});
	
	$("#toggleSelectLoginProfile").click(function(e) {
		$("#createPartnerProfile").fadeOut("fast", function() {
			$("#selectPartnerProfile").fadeIn();
		});
		e.preventDefault();
		e.stopPropagation();
	});
	
	$(".submitCreatePartnerEmail").click(function() {
		$("#selectPartnerProfile").fadeOut("slow", function() {
			$("#createPartnerProfile").fadeIn();
		});
	});
	
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
		
		/* password confirm */
		var pwd = $("#updatePartnerForm #password");
		var confirmPwd = $("#updatePartnerForm #passwordConfirm");
		if(pwd.val() != confirmPwd.val()) {
			$(pwd).addClass("invalid");
			var pwdHelper = $(pwd).siblings(".helper-text");
			$(pwdHelper).attr('data-error', 'Your passwords do not match');
			nameErrors++;
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
