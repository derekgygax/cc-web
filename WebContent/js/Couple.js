"use strict";
//An object to hold the Couple information

//TODO
//THis is going to be weired when you start incorporating Partners


var Couple = Object.create(XHR);
//These are the properties that will be defined by the function setUp
//		coupleId;
//		timeTogether;
//		relationshipType;
//		//datetime initial_start_data;
//		visibility;
//		active;
//		archived;
//		couplesStory;
//		//datetime update_data
//		partnerIdLower;
//		partnerIdHigher;
//		partnerLower;
//		partnerHigher;
//		numChildren
Couple.setup = function(object){
	for (let key in object){
		this[key] = object[key];
	}
};

Couple.checkRequiredInputIsFilled = function(){
	let failedFields = {};
	let requiredKeys = CONFIGURATION.INPUT_REQUIRED["COUPLE"]["UPDATE"];
	for (let i = 0; i < requiredKeys.length; i++){
		if (!this[requiredKeys[i]]){
			failedFields[requiredKeys[i]] = true;
		}
	}
	return failedFields;
};

Couple.isNumChildrenValid = function(numberOfChildren){
	if (!CommonFunctions.isNumber(numberOfChildren)){
		return false;
	} else {
		return true;
	}
};

Couple.checkInputFields = function(){
	let failedFields = this.checkRequiredInputIsFilled();
	// Number of children is a number
	if (!this.isNumChildrenValid(this.numChildren)){
		failedFields["numChildren"] = true;
	}
	return Object.keys(failedFields);
};


Couple.updateInfo = function(responseFn){
	var processResponse = function(rStatus, rText){
		responseFn(rStatus, rText);
	};
	// The location is saved as a string like this {"lat":43.23,"lon":3234.54}
	// so we need to parse it again before the whole info is stringified later
	// If we dont then Java on the backend can't handle it
	if (this.location && typeof this.location == "string"){
		this.location = JSON.parse(this.location);
	}
	this.sendLocalRequest(
			CONFIGURATION.LOCAL_SERVLET.UPDATE_COUPLE,
			CONFIGURATION.SERVLET.UPDATE_COUPLE,
			"POST",
			[],
			this,
			processResponse
	);
};

Couple.getDetailCard = function(responseFn){
	var responseDetailCard = function(rStatus, rContent){
		if (rStatus == 200){
			responseFn(rContent);
		} else {
//			TODO
//			DO SOMETHING!!!
		}
	};
	this.sendLocalRequest(
		CONFIGURATION.LOCAL_SERVLET.GET_RECOMMENDED_COUPLE,
		null,
		"GET",
		null,
		{"coupleId": this.coupleId},
		responseDetailCard
	);	
};

Couple.addPhotos = function(images, responseFn){
	var responseAddImages = function(rStatus, rText){
		if (rStatus == 200){
			responseFn(rStatus, rText, images);
		} else {
			
		}
	};
	this.sendLocalMultipPartRequest(
		CONFIGURATION.LOCAL_SERVLET.IMAGES,
		null,
		"POST",
		null,
		images,
		responseAddImages
	);
};


//TODO
// THis is currently messed up!!
// Please fix Derek!
Couple.approveProfile = function(acApprove, responseFn){
	var processResponse = function(rStatus, approveStatus){
		if (rStatus == 200){
			responseFn(approveStatus);
		} else {
//			Something bad has happened!!
//			TODO
//			Put something here!!!
		}
	};
	this.sendRequestThroughRouter(
		CONFIGURATION.SERVLET.APPROVE_PROFILE, 
		"POST", 
		[this.coupleId], 
		acApprove, 
		processResponse
	);
};


Couple.block = function(responseFn){
	var processResponse = function(rStatus, rText){
		if (rStatus == 200){
			responseFn(rStatus, rText);
		} else {
//			Something bad has happened!!
//			TODO
//			Put something here!!!
		}		
	};
	this.sendRequestThroughRouter(
		CONFIGURATION.SERVLET.BLOCK, 
		"POST", 
		[this.coupleId], 
		null, 
		processResponse
	);
};

Couple.updateLocation = function(current_location, responseFn, changeLocationOnForm){
	let _this = this;
	let changeLocation = function(location){
		changeLocationOnForm(location);
		_this.location = location;
		//console.log($("#updateCoupleForm").serializeArray());
		//_this.updateInfo(responseFn);
		UPDATE_COUPLE.update($("#updateLocation"));
	};
	if (current_location){
		changeLocation(current_location);
	} else {
		CommonFunctions.getCurrentLocation(changeLocation);
	}
}

Couple.deletePhotos = function(imgNums, responseFn){
	let deletePhotosResponseFn = function(rStatus, rText){
		responseFn(rStatus, rText);
	};
	this.sendLocalDeleteRequest(
		CONFIGURATION.LOCAL_SERVLET.IMAGES,
		imgNums,
		deletePhotosResponseFn
	);
};




