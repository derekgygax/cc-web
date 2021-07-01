"use strict";

let CREATE_ACCOUNT = {
		
	displayValidation: function(element, text){
		// First remove the failedField class
		element.classList.remove("failedField");
		// Check the validity and show it
		if (text){
			$("#"+element.id+"_error").text(text);
			element.classList.add("failedField");
			return false;
		} else {
			$("#"+element.id+"_error").text("");
			return true;
		}
	},
		
	isPasswordConfirmed: function(password, confirmedPassword){
		let failTxt = "";
		let passNode = document.getElementById("password");
		let confirmPassNode = document.getElementById("confirmPassword");
		passNode.classList.remove("failedField");
		confirmPassNode.classList.remove("failedField");
		if (password && confirmedPassword){
			if (password != confirmedPassword){
				failTxt = "Your password and confirm password do not match";
			}
		}
		$("#confirmPassword_error").text(failTxt);
		if (failTxt){
			passNode.classList.add("failedField");
			confirmPassNode.classList.add("failedField");
			return false;
		} else {
			passNode.classList.remove("failedField");
			confirmPassNode.classList.remove("failedField");
			return true;
		}
	},
};


window.onload = function(){
	
	//CAN YOU DEFINE partner separately each time!!!!
//	CAN YOU DEFINE partner separately each time!!!!
//	CAN YOU DEFINE partner separately each time!!!!
//	CAN YOU DEFINE partner separately each time!!!!
//	CAN YOU DEFINE partner separately each time!!!!
//	CAN YOU DEFINE partner separately each time!!!!
//	TODO
	
	$("#emailAddress").on('input', function(){
		let partner = Object.create(Partner);
		CREATE_ACCOUNT.displayValidation(this, partner.checkEmail(this.value));
	});
	
	$("#password").on('input', function(){
		CREATE_ACCOUNT.isPasswordConfirmed(this.value, $("#confirmPassword").val());
	});
	
	$("#confirmPassword").on('input', function(){
		CREATE_ACCOUNT.isPasswordConfirmed($("#password").val(), this.value);
	});
	
	
	$("#cancelCreateButton").click(function(){
		window.location.href = CONFIGURATION.WEBPAGES.LOGIN;
	});
	
	// Key down events
	$(document).keydown(function(e) {
		switch(e.which) {
		// Make the enter button trigger a create account if you are on the password or confirm password input
		case 13:
			let activeElement = document.activeElement.id;
			if (activeElement == "password" || activeElement == "confirmPassword"){
				document.getElementById("createButton").click();
			}
		}
	});
	
	$("body").on("submit", "#createCoupleRequirementForm", function(e) {
		e.preventDefault();
		var newPartner = $(this).serializeArray();
		var partner = {};
		newPartner.forEach(function(element) {
			partner[element.name] = element.value;
		});
		partner['gender'] = $("#createCoupleRequirementGender").val();
		console.log(partner);
		var errors = 0;
		
		if(!partner.firstName) {
			$("#createCoupleRequirementFirstName").addClass("invalid");
			$("#createCoupleRequirementFirstName").siblings(".helper-text").attr('data-error', 'Please provide a first name');
			errors++;
		}
		if(!partner.lastName) {
			$("#createCoupleRequirementLastName").addClass("invalid");
			$("#createCoupleRequirementLastName").siblings(".helper-text").attr('data-error', 'Please provide a last name');
			errors++;
		}
		
		var age = partner.age;
		if(age) {
			if(isNaN(parseInt(age))) {
				$("#createCoupleRequirementAge").addClass("invalid");
				$("#createCoupleRequirementAge").siblings(".helper-text").attr('data-error', 'Age must be a number');
				errors++;
			} else {
				age = parseInt(age);
			}
			if(age > 125) {
				$("#createCoupleRequirementAge").addClass("invalid");
				$("#createCoupleRequirementAge").siblings(".helper-text").attr('data-error', 'Please enter a realistic age');
				errors++;
			}
			if(age < 18) {
				console.log("Here");
				$("#createCoupleRequirementAge").addClass("invalid");
				$("#createCoupleRequirementAge").siblings(".helper-text").attr('data-error', 'You must be 18 years old or older');
				errors++;
			}
		} else {
			$("#createCoupleRequirementAge").addClass("invalid");
			$("#createCoupleRequirementAge").siblings(".helper-text").attr('data-error', 'You must enter an age');
		}
		
		var gender_option = $('#createCoupleRequirementGender').val();
		if(gender_option == "" || gender_option == null) {
			$("#createCoupleRequirementGender").siblings("input").addClass("invalid");
			$("#createCoupleRequirementGender").parent().siblings(".helper-text").attr('data-error', 'Please select a gender.');
			errors++;
		}
		
		if(errors === 0) {
    		$(".createCoupleRequirementFormButton").addClass("green");
    		$(".createCoupleRequirementFormButton").removeClass("light-blue");
    		
    		$.ajax({
    		    type: "POST",
    		    url: "/create-couple-requirement",
                data: JSON.stringify(partner),
    		    success: function(rText, textStatus, xhr){
    		    	rText = JSON.parse(rText);
    		    	console.log(rText);
    		    },
    		    error: function(xhr, ajaxOptions, thrownError){
    		    	console.log(xhr);
    		    	console.log(ajaxOptions);
    		    	console.log(thrownError);
    		    }
    		});   		
    		
    	}
	});
	
	$("body").on("submit", ".createAccountForm", function(e){
		e.preventDefault();
		let errors = 0;
		let thisForm = this;
		let caResponseFn = function(rStatus, rText){
			rText = JSON.parse(rText);
	    	if (rStatus == 200){
	    		if (!rText.hasOwnProperty("error")){
		    		window.location.href = CONFIGURATION.WEBPAGES.PROFILE;
	    		} else {
	        		$("#createAccountsubmitbutton").addClass("light-blue");
	        		$("#createAccountsubmitbutton").removeClass("green");
	    			if (rText.error.hasOwnProperty("duplicate")){
	    				if (rText.error.duplicate.hasOwnProperty("email")){
	    					$(thisForm.elements['emailAddress_higher']).addClass('invalid');
	    					$(thisForm.elements['emailAddress_higher']).parent().find('.helper-text').attr('data-error', rText.error.duplicate.email);

	    				}
	    			}
	    		}
	    	} else {
//		    		TODO
//		    		Put something better here!!
	    		//Mark the input as readonly until after the request is done
//	    		CommonFunctions.markInputReadOnly($("#newUser").find("input"), false);
	    	}
		};
		
		//Mark the input as readonly
//		CommonFunctions.markInputReadOnly($("#newUser").find("input"), true);
		
		// Get the new account info and create accout
		let newAccounts = {};
		let formElements = e.target.elements;
		for (let i =0; i < formElements.length; i++){
			let element = formElements[i];
			if (element.name){
				let elementNameSplit = element.name.split("_");
				let elementName = elementNameSplit.slice(0, elementNameSplit.length - 1).join("_");
				let partnerType = elementNameSplit[elementNameSplit.length - 1];
				if (!newAccounts.hasOwnProperty(partnerType)){
					newAccounts[partnerType] = {};
				}
				newAccounts[partnerType][elementName] = element.value;
			}
		}
		
		let newPartners = {};
		for (let partnerType in newAccounts){
			let partner = Object.create(Partner);
			partner.setup(newAccounts[partnerType]);
			newPartners[partnerType] = partner;
		}
		
		
		let failedFields = newPartners["higher"].checkInputFields("create");
		if (Object.keys(failedFields).length > 0){
			let failedText  = "Please fix the following\n";
			for (let field in failedFields){
				var fieldSelector = formElements[field + "_higher"];
				var helperText = $(fieldSelector).parent().find('.helper-text')[0];

				$(fieldSelector).addClass('invalid');
				$(helperText).attr('data-error', failedFields[field]);
				failedText += "\t" + field + ": " + failedFields[field] + "\n"; 
				errors++;
			}
			//alert(failedText)
			return false;
		}
		//TODO WHAT DOES THIS DO
		//TODO WHAT DOES THIS DO
		//TODO WHAT DOES THIS DO
		//TODO WHAT DOES THIS DO
		//TODO WHAT DOES THIS DO
		//TODO WHAT DOES THIS DO
		//TODO WHAT DOES THIS DO

//		if (!CREATE_ACCOUNT.isPasswordConfirmed($("#password").val(), $("#confirmPassword").val())){
//			CommonFunctions.markInputReadOnly($("#newUser").find("input"), false);
//			alert("Password and Confirm Password do not match");
//			return false;
//		}
		
		
//		TODO
//		This is hardcoding that has to go!!
		// why yes it does....
		for (let partnerType in newPartners){
			if(!newPartners[partnerType].firstName) {
				$("#createAccountfirstName_"+partnerType).addClass("invalid");
				$("#createAccountfirstName_"+partnerType).siblings(".helper-text").attr('data-error', 'Please provide a first name');
				errors++;
			}
			if(!newPartners[partnerType].lastName) {
				$("#createAccountlastName_"+partnerType).addClass("invalid");
				$("#createAccountlastName_"+partnerType).siblings(".helper-text").attr('data-error', 'Please provide a last name');
				errors++;
			}
			var age = $("#createAccountAge_"+partnerType).val();
			
			if(age) {
				if(isNaN(parseInt(age))) {
					$("#createAccountAge_"+partnerType).addClass("invalid");
					$("#createAccountAge_"+partnerType).siblings(".helper-text").attr('data-error', 'Age must be a number');
					errors++;
				} else {
					age = parseInt(age);
				}
				if(age > 125) {
					$("#createAccountAge_"+partnerType).addClass("invalid");
					$("#createAccountAge_"+partnerType).siblings(".helper-text").attr('data-error', 'Please enter a realistic age');
					errors++;
				}
				if(age < 18) {
					console.log("Here");
					$("#createAccountAge_"+partnerType).addClass("invalid");
					$("#createAccountAge_"+partnerType).siblings(".helper-text").attr('data-error', 'You must be 18 years old or older');
					errors++;
				}
			} else {
				$("#createAccountAge_"+partnerType).addClass("invalid");
				$("#createAccountAge_"+partnerType).siblings(".helper-text").attr('data-error', 'You must enter an age');
			}
			
			var gender_option = $('#gender_select_'+partnerType+' option:selected')[0]['index'];
			if(gender_option == 0) {
				$("#gender_select_"+partnerType).siblings("input").addClass("invalid");
				$("#gender_select_"+partnerType).parent().siblings(".helper-text").attr('data-error', 'Please select a gender.');
				errors++;
			}
		}
		
		if (newPartners['higher'].password != newPartners['higher'].passwordConfirm){
			$("#createAccountpassword_higher").addClass("invalid");
			$("#createAccountpassword_higher").siblings(".helper-text").attr('data-error', 'Passwords must match');
			$("#createAccountpasswordConfirm_1").addClass("invalid");
			//alert("Password and confirm must match");
			errors++;
			//return false;
		} else {
			delete newPartners['higher'].passwordConfirm;
		}
		
    	if(errors === 0) {
    		$("#createAccountsubmitbutton").addClass("green");
    		$("#createAccountsubmitbutton").removeClass("light-blue");
    		
    		
    		
    		
    		$.ajax({
    		    type: "POST",
    		    url: "/create-account",
                data: JSON.stringify(newPartners),
    		    success: function(rText, textStatus, xhr){
    		    	caResponseFn(xhr.status, rText);
    		    },
    		    error: function(xhr, ajaxOptions, thrownError){
    		    	console.log(xhr);
    		    	console.log(ajaxOptions);
    		    	console.log(thrownError);
    		    }
    		});   		
    		
    		
    		
    		
    		
    		
//    		THIS IS WHERE YOU HAVE TO SEND TWO REQUESTS!!!
//    		newPartner.createAccount(caResponseFn);
    	}
    	
	})
	
};
