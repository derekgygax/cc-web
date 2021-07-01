"use strict";

//PAGE IS OBSOLETE!!

let PROFILE_PAGE = {
		
	loadPartnerAndCouple: function(){
		let thisProfilePage = this;
		let processPage = function(){
			thisProfilePage.changeLayoutForCouple();
		};
		this.partnerLoggedIn.getMyInfo(processPage);
	},
	//Change the screen based upon the status of the partner or the couple
	changeLayoutForCouple: function(){
		let thisProfilePage= this;
//				//TODO
//				This is where you do if the couple is visible or NOT!!!!
//				You might need to change this!!!
//				TODO
//				WHEN YOU LEARN HOW BRING THIS BACK!!!
//				if (!CONFIGURATION.COUPLE_VISIBILITY[coupleLoggedIn.visibility]){
//					$("#messagesLink").hide();
//					$("#recommendedCouplesLink").hide();
//					$("#mesagesLinkNo").show();
//					$("#recommendedCouplesLinkNo").show();
//				} else {
//				}
		let showNames = function(){
			let highOrLow = null;
			let nameType = null;
			if (thisProfilePage.coupleLoggedIn.partnerHigher.partnerId == thisProfilePage.partnerLoggedIn.partnerId){
				highOrLow = "partnerLower";
			} else {
				highOrLow = "partnerHigher";
			}
			if (thisProfilePage.coupleLoggedIn[highOrLow]['firstName']){
				nameType = "firstName";
			} else {
				nameType = "username";
			}
			$("#otherPartnerInCouple").text(thisProfilePage.coupleLoggedIn[highOrLow][nameType]);
		};
		//If the coupleId exists then show update couple and hide couple up
		//TODO
		//You might need to change this to something else
		if (this.coupleLoggedIn.coupleId != "null"){
			$("#coupleUpDiv").hide();
			$("#updateCoupleDiv").show();
			$("#messagesLink").show();
			$("#recommendedCouplesLink").show();
			$("#searchLink").show();
			CommonFunctions.loadPartnersInfoInCouple(this.coupleLoggedIn, showNames);
		} else {
			$("#updateCoupleDiv").hide();	
			$("#coupleUpDiv").show();
			$("#messagesLink").hide();
			$("#recommendedCouplesLink").hide();
			$("#searchLink").hide();
		}
		
	},
};


let CouplingUp = {
		
	Requests: {
		Request: {
			setup: function(partnerId, parentObject){
				this.div = CommonFunctions.getEl("div");
				this.parentObject = parentObject;
				this.partner = Object.create(Partner);
				this.partner.partnerId = partnerId;
				let thisRequest = this;
				let finishBuilding = function(){
					if (thisRequest.partner.firstName && thisRequest.partner.lastName){
						thisRequest.displayName = thisRequest.partner.firstName + " " + thisRequest.partner.lastName;
					} else {
						thisRequest.displayName = thisRequest.partner.username;
					}
					thisRequest.buildNode();
				};
				this.partner.getMyInfo(finishBuilding);
			},
			setupNew: function(parentObject){
				let thisRequest = this;
				//Partner
				this.parentObject = parentObject;
				this.partner = Object.create(Partner);
				// Node
				this.div = CommonFunctions.getEl("div");
				let label = CommonFunctions.getEl("label");
				label.textContent = "Partner's username: ";
				CommonFunctions.addEl(this.div, label);
				let inputNode = CommonFunctions.getEl("input");
				this.inputNode = inputNode;
				inputNode.addEventListener('input', function(){
					thisRequest.partner.username = this.value;
				});
				CommonFunctions.addEl(this.div, inputNode);
				let button = CommonFunctions.getEl("button");
				button.textContent = "Request";
				button.addEventListener('click', function(){
					if (thisRequest.partner.username == "" || inputNode.value == ""){
						alert("Please enter a username");
						inputNode.focus();
						return false;
					}
					thisRequest.requestAction("send");
				});
				CommonFunctions.addEl(this.div, button);
				CommonFunctions.addEl(this.parentObject.div, this.div);
			},
			clearInput: function(){
				this.inputNode.value = "";
				this.partner.username = "";
			},
			buildNode: function(){
				let thisRequest = this;
				this.div.classList.add("requestAwayPartner");
				let partnerPic = CommonFunctions.getEl("img");
				partnerPic.src = "";
				CommonFunctions.addEl(this.div, partnerPic);
				let partnerName = CommonFunctions.getEl("h3");
				CommonFunctions.addEl(partnerName, CommonFunctions.getTn(this.displayName));
				CommonFunctions.addEl(this.div, partnerName);
				if (this.parentObject.type == 'from'){
					let acceptButton = CommonFunctions.getEl("button");
					CommonFunctions.addEl(acceptButton, CommonFunctions.getTn("Accept"));
					acceptButton.addEventListener('click', function(){
						thisRequest.requestAction("accept");
					});
					CommonFunctions.addEl(this.div, acceptButton);
					let declineButton = CommonFunctions.getEl("button");
					CommonFunctions.addEl(declineButton, CommonFunctions.getTn("Decline"));
					declineButton.addEventListener('click', function(){
						thisRequest.requestAction("decline");
					});
					CommonFunctions.addEl(this.div, declineButton);
				} else {
					let revokeButton = CommonFunctions.getEl("button");
					CommonFunctions.addEl(revokeButton, CommonFunctions.getTn("Revoke"));
					revokeButton.addEventListener('click', function(){
						thisRequest.requestAction("revoke");
					});
					CommonFunctions.addEl(this.div, revokeButton);
				}
				// You should probably be using all JS or all JQuery
				CommonFunctions.addEl(this.parentObject.div, this.div);
			},
			getPartnerIdAsObject: function(){
				return {
					"partnerId": this.partner.partnerId
				}
			},
			requestAction: function(action){
				let thisRequest = this;
				//TODO Is that test going to be something???
				let processAction = function(rStatus, rText){
					if (rStatus == 200){
						switch (action) {
							case "accept":
								localStorage.coupleId = rText;
								PROFILE_PAGE.coupleLoggedIn.coupleId = rText;
								let otherPartnerDisplayName = thisRequest.displayName;
								// Remove all requests
								thisRequest.parentObject.parentObject.removeAllRequests();
								// Build an accepted message node
								thisRequest.parentObject.parentObject.showAccepted(otherPartnerDisplayName);
								break;
							case "decline":
								thisRequest.parentObject.declineRequest(thisRequest.partner.partnerId);
								break;
							case "revoke":
								thisRequest.parentObject.revokeRequest(thisRequest.partner.partnerId);
								break;
							case "send":
								//rText is the requested partner's partnerId
								thisRequest.parentObject.removeAllRequests();
								thisRequest.parentObject.parentObject.fillAndShowTo(rText);
								break;
						}
					} else if (rStatus == 400) {
						switch (action){
							case "send":
								let message = JSON.parse(rText)['message'];
								message += "\nPlease request someone else.";
								thisRequest.clearInput();
								alert(message);
						}
						//TODO
						// Do something here!!!!
					}
				};
				if (this.parentObject.type == "new"){
					PROFILE_PAGE.partnerLoggedIn.coupleRequestAction({"username": this.partner.username}, action, processAction);
				} else {
					PROFILE_PAGE.partnerLoggedIn.coupleRequestAction(this.getPartnerIdAsObject(), action, processAction);			
				}
			}
		},
		setup: function(type, parentObject){
			this.type = type,
			this.parentObject = parentObject;
			this.div = CommonFunctions.getEl("div");
			this.div.id = "partnerRequests_"+type;
			this.div.classList.add("requestsDiv");
			let title = CommonFunctions.getEl("h3");
			if (type == 'to'){
				CommonFunctions.addEl(title, CommonFunctions.getTn("People you have requested to be a couple with."));
			} else if (type == "from"){
				CommonFunctions.addEl(title, CommonFunctions.getTn("People requesting to be a couple with you."));
			} else {
				CommonFunctions.addEl(title, CommonFunctions.getTn("Send a Request"));
			}
			CommonFunctions.addEl(this.div, title);
			this.requests = {};
			// You should probably be using all JS or all JQuery
			CommonFunctions.addEl(this.parentObject.requestsNode, this.div);
		},
		clearInput: function(){
			if (this.requests['new']){
				this.requests['new'].clearInput();
			}
		},
		noRequests: function(){
			if (Object.keys(this.requests).length == 0){
				return true;
			} else {
				return false;
			}
		},
		addNewInput: function(){
			this.requests['new'] = Object.create(this.Request);
			this.requests['new'].setupNew(this);
		},
		setupNew: function(parentObject){
			this.type = "new";
			this.parentObject = parentObject;
			this.div = CommonFunctions.getEl("div");
			CommonFunctions.addEl(this.parentObject.requestsNode, this.div);
		},
		addPartners: function(ids){
			for (let i=0; i < ids.length; i++){
				this.addPartner(ids[i]);
			}			
		},
		addPartner: function(partnerId){
			let req = Object.create(this.Request);
			this.requests[partnerId] = req;
			req.setup(partnerId, this);
		},
		declineRequest: function(partnerId){
			this.removeRequest(partnerId);
		},
		revokeRequest: function(partnerId){
			this.removeRequest(partnerId);
			if (this.noRequests()){
				this.parentObject.fillAndShowNew();
			}
		},
		removeAllRequests: function(){
			for (let idr in this.requests){
				this.removeRequest(idr);
			}
		},
		removeRequest: function(idr){
			this.div.removeChild(this.requests[idr].div);
			delete this.requests[idr];
			if (this.noRequests()){
				$(this.div).hide();
			}
		}
	},
	setup: function(){
		this.wholeNode = document.getElementById("requestCoupleDiv");
		this.splashScreen = document.getElementById("splashScreen");
		this.requestsNode = CommonFunctions.getEl("div");
		CommonFunctions.addEl(this.wholeNode, this.requestsNode);
		this.requestsNode.id = "requests";
		this.requests = {
			"new": Object.create(this.Requests),
			"to": Object.create(this.Requests),
			"from": Object.create(this.Requests),
		};
		this.requests['new'].setup("new", this);
		this.requests['to'].setup('to', this);
		this.requests['from'].setup('from', this);
		let thisCouplingUp = this;
		let processRequestsRetrieved = function(coupleRequests){
			if (coupleRequests['to'].length == 0){
				$(thisCouplingUp.requests['new'].div).show();
				thisCouplingUp.requests['new'].addNewInput();
			} else {
				$(thisCouplingUp.requests['to'].div).show();
				thisCouplingUp.requests['to'].addPartners(coupleRequests['to']);
			}
			if (coupleRequests['from'].length > 0){
				$(thisCouplingUp.requests['from'].div).show();
				thisCouplingUp.requests['from'].addPartners(coupleRequests['from']);
			}
		}
		// Retrieving the requests you have sent and have been sent to you
		PROFILE_PAGE.partnerLoggedIn.getCoupleRequests(processRequestsRetrieved);
		// Close the request modal
		let closeButton = CommonFunctions.getEl("button");
		closeButton.id = "closeCoupleUp";
		closeButton.textContent = "Close";
		closeButton.addEventListener('click', function(){
			thisCouplingUp.hide();
		});
		CommonFunctions.addEl(this.wholeNode, closeButton);
	},
	removeAllRequests: function(){
		this.requests['new'].removeAllRequests();
		this.requests['to'].removeAllRequests();
		this.requests['from'].removeAllRequests();
	},
	fillAndShowNew: function(){
		$(this.requests['new'].div).show();
		this.requests['new'].addNewInput();
	},
	fillAndShowTo: function(newPartnerId){
		$(this.requests['to'].div).show();
		this.requests['to'].addPartner(newPartnerId);
	},
	hide: function(){
		$(this.splashScreen).hide();
		$(this.wholeNode).hide();
		this.requests['new'].clearInput();
	},
	show: function(){
		$(this.splashScreen).show();
		$(this.wholeNode).show();
	},
	showAccepted: function(partnerDisplayName){
		// Build an accepted message node and send it to the node in the parent of the parent
		// to show who you are a couple with
		let acceptMessageNode = CommonFunctions.getEl("div");
		let partnerSpecifyNode = CommonFunctions.getEl("h2");
		CommonFunctions.addEl(partnerSpecifyNode, CommonFunctions.getTn("You are a couple with " + partnerDisplayName));
		CommonFunctions.addEl(acceptMessageNode, partnerSpecifyNode);
		$(this.requests['new'].div).hide();
		$(this.requests['to'].div).hide();
		$(this.requests['from'].div).hide();
		CommonFunctions.addEl(this.requestsNode, acceptMessageNode);
		PROFILE_PAGE.changeLayoutForCouple();
	},
	
};



window.onload = function(){
	
	let couplingUp = Object.create(CouplingUp);
	couplingUp.setup();
	
	$("#launchAddPhoto").on('click', function(){
		document.getElementById('addPhoto').click();
	});
	
//Coupling Up things
	$("#launchCoupleUp").on('click', function(){
		couplingUp.show();
	});
	
	$("#closeCoupleUp").on('click', function(){
		couplingUp.hide();
	});
	
	$("#splashScreen").click(function(){
		couplingUp.hide();
	});
};

// Set the href for the links
document.getElementById("updatePartnerLink").href = CONFIGURATION.WEBPAGES.UPDATE_PARTNER;
document.getElementById("updateCoupleLink").href = CONFIGURATION.WEBPAGES.UPDATE_COUPLE;
document.getElementById("messagesLink").href = CONFIGURATION.WEBPAGES.MESSAGES;
document.getElementById("recommendedCouplesLink").href = CONFIGURATION.WEBPAGES.RECOMMENDED_COUPLES;
document.getElementById("surveyLink").href = CONFIGURATION.WEBPAGES.SURVEY;
document.getElementById("searchLink").href = CONFIGURATION.WEBPAGES.SEARCH;

// Put the username at the top of the screen
document.getElementById("usernameOfLogIn").textContent = localStorage.username;

// Initial setup of the partner and the couple
PROFILE_PAGE.partnerLoggedIn = Object.create(Partner);
PROFILE_PAGE.partnerLoggedIn.setup({
	"username" : localStorage.username,
	"password" : localStorage.password,
	"partnerId" :localStorage.partnerId 
});

PROFILE_PAGE.coupleLoggedIn = Object.create(Couple);
PROFILE_PAGE.coupleLoggedIn.coupleId = localStorage.coupleId;

// Load all the partner and couple info AND
// Show the correct links
PROFILE_PAGE.loadPartnerAndCouple();




