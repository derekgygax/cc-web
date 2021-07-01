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
	$("#username").on('input', function(){
		let partner = Object.create(Partner);
		CREATE_ACCOUNT.displayValidation(this, partner.checkUsername(this.value));
	});
	
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
	    				if (rText.error.duplicate.hasOwnProperty("username")){
	    					$(thisForm.elements['username']).addClass('invalid');
	    					$(thisForm.elements['username']).parent().find('.helper-text').attr('data-error', rText.error.duplicate.username);
	    				}
	    				if (rText.error.duplicate.hasOwnProperty("email")){
	    					$(thisForm.elements['emailAddress']).addClass('invalid');
	    					$(thisForm.elements['emailAddress']).parent().find('.helper-text').attr('data-error', rText.error.duplicate.email);

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
		let newAccount = {};
		let formElements = e.target.elements;
		for (let i =0; i < formElements.length; i++){
			let element = formElements[i];
			if (element.name){
				newAccount[element.name] = element.value;
			}
		}
		let newPartner = Object.create(Partner);
		newPartner.setup(newAccount);
		
		
		let failedFields = newPartner.checkInputFields("create");
		if (Object.keys(failedFields).length > 0){
			let failedText  = "Please fix the following\n";
			for (let field in failedFields){
				var fieldSelector = formElements[field];
				var helperText = $(fieldSelector).parent().find('.helper-text')[0];
				console.log(fieldSelector);
				console.log(helperText);
				$(fieldSelector).addClass('invalid');
				$(helperText).attr('data-error', failedFields[field]);
				failedText += "\t" + field + ": " + failedFields[field] + "\n"; 
				errors++;
			}
			//alert(failedText)
			//return false;
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
		if(!newPartner.firstName) {
			$("#createAccountfirstName").addClass("invalid");
			$("#createAccountfirstName").siblings(".helper-text").attr('data-error', 'Please provide a first name');
			errors++;
		}
		if(!newPartner.lastName) {
			$("#createAccountlastName").addClass("invalid");
			$("#createAccountlastName").siblings(".helper-text").attr('data-error', 'Please provide a last name');
			errors++;
		}
		
		if (newPartner.password != newPartner.passwordConfirm){
			console.log(formElements);
			$("#createAccountpassword").addClass("invalid");
			$("#createAccountpassword").siblings(".helper-text").attr('data-error', 'Passwords must match');
			$("#createAccountpasswordConfirm").addClass("invalid");
			//alert("Password and confirm must match");
			errors++;
			//return false;
		} else {
			delete newPartner.passwordConfirm;
		}
		
    	if(errors === 0) {
    		$("#createAccountsubmitbutton").addClass("green");
    		$("#createAccountsubmitbutton").removeClass("light-blue");
    		newPartner.createAccount(caResponseFn);
    	}
    	
	})
	
};
