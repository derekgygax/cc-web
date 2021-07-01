"use strict";

let INDEX = {
		
		login: function(){
			let username = $("#usernameInput").val();
			let password = $("#passwordInput").val();
			let loginResponseFn = function(responseStatus, partnerCoupleId){
				//TODO
				//Improve noticing errors
				CommonFunctions.markInputReadOnly($("#loginSection").find("input"), false);
				//401 is the response if the username and password aren't in the database
				if (responseStatus == 401){
					alert("The username or password is incorrect. Please try again.");
					$("#passwordInput").val("");
				} else if (responseStatus == 200){
					partnerCoupleId = JSON.parse(partnerCoupleId);
					CommonFunctions.setLocalStorage(username, password, partnerCoupleId["partnerId"], partnerCoupleId["coupleId"]);
					window.location.href = CONFIGURATION.WEBPAGES.PROFILE;
				} else {
					alert("An error has occurred. Please try again.");
				}
			};
			var partner = Object.create(Partner);
			partner.setup({
				    "username" : username,
				    "password" : password
			});
			//Mark all the input as readonly during the AJAX call
			CommonFunctions.markInputReadOnly($("#loginSection").find("input"), true);
			partner.login(loginResponseFn);
		},
		
		forgotPassword: function(){
			let email = $("#emailInput").val();
			let fpResponseFn = function(rStatus, rText){
				CommonFunctions.markInputReadOnly($("#forgotPasswordDiv").find("input"), false);
				//TODO
				//This is where you need to change what is written with making a new password!!
				//TODO
				//ALSO THIS WHERE YOU NEED TO START USING THE rSTatus sent back to you!!
				if (rText == CONFIGURATION.CHANGE_PASSWORD_RESPONSE.SENT){
					$("#cpResponse").val("You have been sent an email with your new password");
					setTimeout(function(){
						$("#cpResponse").val("");
						INDEX.fpHide();
					}, 3000);
				} else if (rText == CONFIGURATION.CHANGE_PASSWORD_RESPONSE.NO_EMAIL){
					$("#cpResponse").val("We don't have a record of that email. Please try another one.");
					$("#emailInput").focus()
				} else {
					//TODO
					//Think of something to do here!!!
				}
			};
			if (!email){
				return false;
			}
			let param = {
					"emailAddress": email
			}
			CommonFunctions.markInputReadOnly($("#forgotPasswordDiv").find("input"), true);
			//The "" are for username and password BUT aren't needed here and actually can't even be sent
			//TODO
			//UNCOMMENT THIS OUT!!!
			var xhrFP = Object.create(XHR);
			xhrFP.sendRequest(CONFIGURATION.SERVLET.CHANGE_PASSWORD, "POST", param, fpResponseFn);
		},
		
		fpHide: function(){
			$("#forgotPasswordDiv").hide();
		},
};


window.onload = function(){
	document.getElementById("createAcountLink").href = CONFIGURATION.WEBPAGES.CREATE_ACCOUNT;
	$("#loginButton").click(function(){
		INDEX.login();
	});
	
	$("#forgotPasswordLink").click(function(){
		$("#forgotPasswordDiv").show();
	});
	
	$("#usernameInput").click(function(){
		INDEX.fpHide();
	});
	
	$("#submitFPButton").click(function(){
		INDEX.forgotPassword();
	});
	
	$(document).keydown(function(e) {
		switch(e.which) {
		// Make the enter button trigger a login if you are on the password input
		case 13:
			let activeElement = document.activeElement.id;
			if (activeElement == "passwordInput"){
				document.getElementById("loginButton").click();
			}
		}
	});
	
};

