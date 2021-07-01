"use strict";

var CommonFunctions = {};

//Check if the input is a number
//Return true or false
CommonFunctions.isNumber = function(input){
	return !isNaN(parseInt(input, 10)) && isFinite(input)	
};

//Convert the gender input from a word to the code or vice versa
//See CONFIGURATION.GENDER_CONVERSION for the stored values
CommonFunctions.convertGender = function(input){
	return CONFIGURATION.GENDER_CONVERSION[input.toLowerCase()];
};

//Convert the gender input from a word to the code or vice versa
//See CONFIGURATION.GENDER_CONVERSION for the stored values
CommonFunctions.convertMaritalStatus = function(input){
	return CONFIGURATION.MARITAL_STATUS_CONVERSION[input.toLowerCase()];
};


//The browser being used does NOT support something required for Couples Connection
//You are sent to an Error webpage
//You could use window.location.href OR window.location.replace() here.
//	They shouldn't go back really anyway because the browser doesn't support Couples Connection
CommonFunctions.sendToErrorBrowser = function (error){
	window.location.href = CONFIGURATION.WEBPAGES.ERROR + "?error="+error;
}

//Mark all the inputs for a form readonly
//This takes place during an AJAX call so the user can't change this input 
//This way the input can be used after the response
CommonFunctions.markInputReadOnly = function(inputs, lock){
	for (var i=0; i < inputs.length; i++){
		if (lock == true){
			inputs[i].setAttribute("readonly", "readonly");
		} else {
			inputs[i].removeAttribute("readonly");
		}
	}
}


CommonFunctions.getEl = function (tag) {
	return document.createElement(tag);
};

CommonFunctions.getTn = function(text) {
	return document.createTextNode(text);
};

CommonFunctions.addEl = function(parent, child) {
	parent.appendChild(child);
	return parent;
};


CommonFunctions.fillDropDown = function(select, keyValues){
	for (let key in keyValues){
		var option = this.addEl(this.getEl("option"), this.getTn(key));
		option.value = keyValues[key]
		this.addEl(select, option);
	}
};

CommonFunctions.loadPartnersInfoInCouple = function(couple, returnFn){
	let afterCoupleGetHighePartner = function(){
		couple.partnerHigher = Object.create(Partner);
		couple.partnerHigher.partnerId = couple.partnerIdHigher;
		let afterHigherGetLower = function(){
			couple.partnerLower = Object.create(Partner);
			couple.partnerLower.partnerId = couple.partnerIdLower;
			let saveBothPartners = function(){
				returnFn();
			}
			couple.partnerLower.getMyInfo(saveBothPartners)
		}
		couple.partnerHigher.getMyInfo(afterHigherGetLower);
	}
	couple.getMyInfo(afterCoupleGetHighePartner);
};

CommonFunctions.removePartnersFromCouple = function(couple){
	for (let iP=0; iP < CONFIGURATION.FIELDS_NOT_IN_UPDATE_COUPLE.length; iP++){
		let unwantedField = CONFIGURATION.FIELDS_NOT_IN_UPDATE_COUPLE[iP];
		if (couple.hasOwnProperty(unwantedField)){
			delete couple[unwantedField];
		}
	}
};

CommonFunctions.pageSetUp = function(pagePath, pageBody){
	this.checkLocalStorage();
	if (pagePath != CONFIGURATION.WEBPAGES.LOGIN && pagePath != CONFIGURATION.WEBPAGES.CREATE_ACCOUNT){
		if (pagePath != CONFIGURATION.WEBPAGES.PROFILE){
			this.addReturnToProfileButton(pagePath, pageBody);
		}
		this.addLogout(pageBody);
	}

};

CommonFunctions.markValidityErrors = function(failedFields){
	if (Object.keys(failedFields).length > 0){
		let fields = Object.keys(failedFields);
		for (let iF=0; iF < fields.length; iF++){
			document.getElementById(fields[iF]).classList.add("failedField");
			document.getElementById(fields[iF]+"_error").textContent = failedFields[fields[iF]];
		}
		alert("The highlighted fields contain errors");
		return false;
	}
	return true
};

CommonFunctions.getCurrentLocation = function(responseFn){
	let buildPositionObject = function(location){
		if (responseFn){
			responseFn(JSON.stringify({
				"lat": location.coords.latitude,
				"lon": location.coords.longitude			
			}));
		}
	};
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(buildPositionObject);
    } else { 
        alert("Geolocation is not supported by this browser.\nPlease use another browser such as Chrome or Firefox");
    }
}

//After you click the facebook login button
//The user has to login right there pretty much so this is a little confusing
//Basically go and retrieve the user's name and ask if they are ok with being that person
//If they are then submit stuff to Kyle and proceed
CommonFunctions.loginWithFB = function(){
	FB.getLoginStatus(function(statusAccessToken) {
		if (statusAccessToken.status === "connected"){
			FB.api("/me", function(userIdName){
				if (confirm("You are logging in as "+userIdName.name+". Ok?")){
					var partner = Object.create(Partner);
					
					var loginResponseFn = function(rStatus, partnerCoupleId){
						var createResponseFn = function(createStatus, partnerId){
							if (createStatus == 200){
					    		CommonFunctions.setLocalStorage(partner.username, partner.password, partnerId, "null");
					    		window.location.href = CONFIGURATION.WEBPAGES.PROFILE;
							} else {
//								TODO
//								DO SOMETHING HERE!!!
							}
						};
						if (rStatus == 200){
							partnerCoupleId = JSON.parse(partnerCoupleId);
							CommonFunctions.setLocalStorage(partner.username, partner.password, partnerCoupleId["partnerId"], partnerCoupleId["coupleId"]);
							window.location.href = CONFIGURATION.WEBPAGES.PROFILE;
						} else if (rStatus == 401) {
							//The log in stuff does not exist
							//Create an account
							partner.createAccount(createResponseFn)
						} else {
							
						}
					};
					
					partner.setup({
						"username" : "!fb!"+userIdName.id,
						"password" : statusAccessToken.authResponse.accessToken
					});
					//Try to login
					partner.login(loginResponseFn);
				} else {
					FB.logout(function(logoutResponse){
						console.log(logoutResponse);
						document.getElementById("fbLoginButton").click();
					});
				}
			});
		} else {
			alert("Please log in to facebook.");
			console.log("Please log in to facebook.");
		}
	});	 
};




