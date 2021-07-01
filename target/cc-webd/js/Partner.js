"use strict";

//An object to hold the Partner information
var Partner = Object.create(XHR);
	//These are the properties that will be defined by the function setUp
	//partnerId;
	//firstName;
	//middleName;
	//lastName;
	//gender;
	//age;
	//maritalStatus;
	//zipcode;
	//numChildren;
	//childrenMinAge;
	//childrenMaxAge;
	//childrenAtHome;
	//		startDate;
	//		endDate
	//promotionPlan; 
	//username;
	//password;
	//password_hash;
	//salt;
	//emailAddress;
	//password; //enables using this class to create account
	//facebookId;
	//phoneNumber;
    
Partner.setup = function(object){
	// TODO Look at the commented out stuff below!!!
//	TODO Look at the commented out stuff below!!!
//	TODO Look at the commented out stuff below!!!
//	TODO Look at the commented out stuff below!!!
//	
	let wrongMatches = {};
	for (let key in object){
		if (key =="partnerId"){
			// TODO What about username and password
			if (this.hasOwnProperty(key)){
				if (this[key] != object[key]){
					wrongMatches[key] = {};
					wrongMatches[key]["is"] = object[key];
					wrongMatches[key]["shouldBe"] = this[key];
				}
			} else {
				this[key] = object[key];
			}
		} else {
			this[key] = object[key];
		}
	}
	if (wrongMatches.hasOwnProperty("partnerId")){
		//TODO
		// Something very wrong has happened here!!!!
		//TODO 
		//DO MORE!!!
		console.log("The partner id of the object used to retrieve info does not match the parnter id returned.");
		console.log("See the following.");
		console.log(wrongMatches);
		let alertMessage = "The partner id of the object used to retrieve info does not match the parnter id returned.\n" +
				"Please logout and log back in.";
		alert(alertMessage);
	}
};
//Check if all the required input fields for the webpage are filled
Partner.checkRequiredFieldsFilled = function(createOrUpdate){
	let failedFields = {};
	let requiredKeys = CONFIGURATION.INPUT_REQUIRED["PARTNER"][createOrUpdate.toUpperCase()];
	for (let i = 0; i < requiredKeys.length; i++){
		if (!this[requiredKeys[i]]){
			failedFields[requiredKeys[i]] = "The field must be filled.";
		}
	}
	return failedFields;
};

Partner.checkUsername = function(username){
	let illegalChars = CONFIGURATION.ILLEGAL_CHARS.USERNAME;
	let badCharsStmt = null;
	if (username){
		let badChars = {};
		for (let i=0; i < illegalChars.length; i++){
			if (username.indexOf(illegalChars[i]) > -1) {
				badChars[illegalChars[i]] = true;
			}
		}
		let allBad = "";
		let badCharKeys = Object.keys(badChars);
		if (badCharKeys.length > 0){
			for (let k=0; k < badCharKeys.length; k++){
				if (k > 0){
					allBad += " ,"
				}
				allBad += badCharKeys[k];
			}
			badCharsStmt = "The character(s) '"+allBad+"' can't be used";
		}
	} 
	return badCharsStmt;
}

Partner.checkEmail = function(email){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	let emailError = "Not a valid e-mail address";
	if (re.test(String(email).toLowerCase())){
		emailError = null
	}
	return emailError;
	
};

// Check the zipcode is a number
Partner.isZipcodeValid = function(zipcode){
	if (!CommonFunctions.isNumber(zipcode)){
		return false;
	} else {
		return true;
	}
};

Partner.isAgeValid = function(age){
	if (!CommonFunctions.isNumber(age)){
		return false;
	} else {
		return true;
	}
};

//Phone number should be able to do
//919191919
//999-999-9999
//	BUT RIGHT NOW YOU CAN"T!!!" +
Partner.isPhoneNumberValid = function(phoneNumber){
	if (phoneNumber.length != 12){
		alert("The phone number must be structed in the following way.\n" +
				"\n\t" +
					"555-666-7777");
		return false;
	}
	return true;
},

// Check all the input is valid for the partner
Partner.checkInputFields = function(createOrUpdate){
	// All required fields are filled
	let failedFields = this.checkRequiredFieldsFilled(createOrUpdate);
	if (createOrUpdate == "create"){
		if (!failedFields.hasOwnProperty("username")){
			let badUserName = this.checkUsername(this.username)
			if (badUserName){
				failedFields["username"] = badUserName;
			}
		}
		//If the email address is not actually an email address then return
		//This check is obsolete as far as I know.
		//Even if the input has content. If it is not an email type then it will send undefined. As far as I have seen so far
		if (!failedFields.hasOwnProperty("emailAddress")){
			let badEmailStmt = this.checkEmail(this.emailAddress);
			if (badEmailStmt){
				failedFields["emailAddress"] = badEmailStmt;
			}
		}
	} else if (createOrUpdate == "update"){
		// zipcode must be a number
		if (!this.isZipcodeValid(this.zipcode)){
			failedFields["zipcode"] = true;
		}
		if (!this.isAgeValid(this.age)){
			failedFields["age"] = true;
		}
	//	TODO
	//	Check phone number in future!!!
	//	if (this.phoneNumber){
	//		if (!this.isPhoneNumberValid(this.phoneNumber)){
	//			return false;
	//		
			// All checks have passed
	}
	return failedFields;
};

//	TODO
//	TODO
//	TODO
//	TODO
//	NEED TO CHECK OUT THE RESPONSES!!!


Partner.createAccount = function(responseFn){
	var cResponse = function(rStatus, rText){
		if (rStatus == 200){
			//This needs further processing because it has the coupleID
			responseFn(rStatus, rText);
		} else {
//				TODO
//				DO SOMETHING
		}
	};
	//AGAIN I SEND "THIS". MAYBE IT DOESN"T NEED TO DO THIS!!!
	//MAYBE I CAN JUST ALWAYS SEND ALL THE STUFF
	//AND MAYBE IT WILL ALWAYS WORK!!
	//NEED TO CHECK MORE PATHS
	this.sendLocalRequest(
		CONFIGURATION.LOCAL_SERVLET.CREATE_ACCOUNT,
		null,
		"POST",
		null,
		this,
		cResponse
	);
}

Partner.login = function(responseFn){
	var loggedIn = function(rStatus, rText){
		responseFn(rStatus, rText);
	};
//		NO DATA IS REQUIRED!!!
	this.sendLocalRequest(
		CONFIGURATION.SERVLET.LOGIN,
		null,
		"POST",
		null,
		this,
		loggedIn
	);
}


//Update the partner info
Partner.updateInfo = function(responseFn){
	var updateResponseFn = function(rStatus, rText){
		if (rStatus == 200){
			responseFn(rStatus, rText);

		} else {
//				TODO
//				DO SOMETHING!!
		}
	}
	this.sendLocalRequest(
			CONFIGURATION.LOCAL_SERVLET.UPDATE_PARTNER,
			CONFIGURATION.SERVLET.UPDATE_PARTNER, 
			"POST", 
			[], 
			this, 
			updateResponseFn
	);

};


//Provide a username of the person you want to be in your couple
//This will call the URL to create the couple
Partner.coupleRequestAction = function(userAndAction, responseFn){
	let processCreatingCouple = function(rStatus, rText){
		responseFn(rStatus, rText);
	};
	this.sendLocalRequest(
			CONFIGURATION.LOCAL_SERVLET.CREATE_COUPLE,
			CONFIGURATION.SERVLET.CREATE_COUPLE,
			"POST",
			null,
			userAndAction,
			processCreatingCouple
	);
};

Partner.answerSurvey = function(answers, responseFn, useBeacon){
	var processResponse = function(rStatus, rText){
		if (rStatus == 200){
			responseFn(rStatus, rText);
		} else {
//			TODO 
//			DO SOMETHING HERE!!!!
		}
	};
	if (useBeacon){
		if ("sendBeacon" in navigator){
			// Need to change this in the future to not use the router
			this.sendBeaconThroughRouter(
					CONFIGURATION.SERVLET.SURVEY_QA,
					"POST",
					null,
					answers
			);
		} else {
			this.sendSynchLocalRequest(
					CONFIGURATION.LOCAL_SERVLET.SURVEY_QA,
					CONFIGURATION.SERVLET.SURVEY_QA,
					"POST",
					null,
					answers,
					processResponse
			);		
		}
	} else {
		this.sendLocalRequest(
				CONFIGURATION.LOCAL_SERVLET.SURVEY_QA,
				CONFIGURATION.SERVLET.SURVEY_QA,
				"POST",
				null,
				answers,
				processResponse
		);
	}
};

Partner.search = function(data, responseFn){
	let processResponse = function(rStatus, rText){
		if (rStatus == 200){
			responseFn(rText);
		}
	};
	this.sendLocalRequest(
		CONFIGURATION.LOCAL_SERVLET.SEARCH,
		null,
		"POST",
		null,
		data,
		processResponse
	);
}	
	
	
	
	
	
	