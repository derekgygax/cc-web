"use strict";
const CONFIGURATION = {};
CONFIGURATION.CC_SERVER = "http://18.216.134.146:8080/cc-server/";
CONFIGURATION.WEBPAGES = {
		"LOGIN": "/cc-web/",
		"CREATE_ACCOUNT": "/cc-web/create_account",
		"PROFILE": "/cc-web/profile",
		"UPDATE_PARTNER": "/cc-web/profile/update",
		"UPDATE_COUPLE": "/cc-web/couple/update",
		"RECOMMENDED_COUPLES": "/cc-web/recommended_couples",
		"SURVEY": "/cc-web/survey",
		"MESSAGES": "messages.html",
		"SEARCH": "/cc-web/search",
		"FAIL_AUTHORIZATION": "fail-authorization.html",
		"ERROR": "error.jsp",
		"MATCHES": "/cc-web/matches",
			"CHAT": "/cc-web/chat"

};
//Names of the servlets to be sent to
CONFIGURATION.SERVLET = {
		"CHANGE_PASSWORD": "change-password",
		"LOGIN" : "login",
		"CREATE_ACCOUNT" : "create-account",
		"UPDATE_PARTNER" : "partner",
		"CREATE_COUPLE" : "create-couple",
		"UPDATE_COUPLE" : "couple/us",
		"GET_PARTNER" : "partner",
		"GET_COUPLE" : "couple",
		"GET_MATCH" : "matches",
		"APPROVE_PROFILE" : "matches",
		"GET_COUPLE_PICS" : "get-couple-pics",
		"ADD_COUPLE_PHOTO" : "",
		"SEND_MESSAGE" : "send-message",
		"ANSWER_QUESTION" : "answer-question",
		"SURVEY": "survey",
		"SURVEY_QA": "survey/qa",
		"CATEGORICAL_QUESTIONS": "categorical",
		"BLOCK": "block",
};
CONFIGURATION.LOCAL_SERVLET = {
		"GET_RECOMMENDED_COUPLE": "recommended_couple",
		"ROUTER": "router",
		"CREATE_ACCOUNT": "create_account",
		"SEARCH": "search",
		"UPDATE_PARTNER" : "/cc-web/profile/update",
		"UPDATE_COUPLE": "/cc-web/couple/update",
		"IMAGES": "/cc-web/images",
		"CREATE_COUPLE": "/cc-web/create_couple",
		"SURVEY_QA": "/cc-web/survey"
}

CONFIGURATION.GET_SERVLETS_WITH_QUESTIONMARK = [
	CONFIGURATION.SERVLET.GET_MATCH,
	CONFIGURATION.SERVLET.SURVEY_QA
];

CONFIGURATION.FB = {
		"APP_ID" : '132046710832884',
		"SDK_VERSION" : "v2.11",
}

CONFIGURATION.IN_LOCAL_STORAGE = [
		"username",
		"password",
		"partnerId",
		"coupleId"
];

CONFIGURATION.GENDER_CONVERSION = {
		"male": "m",
		"female": "f",
		"transvestite": "t",
		"other": "o",
		"m": "Male",
		"f": "Female",
		"t": "Transvestite",
		"o": "other"
};

CONFIGURATION.MARITAL_STATUS_CONVERSION = {
		"married": "m",
		"unmarried": "n",
		"n": "Unmarried",
		"m": "Married",
};

CONFIGURATION.RELATIONSHIP_TYPE_CONVERSION = {
		"L" : "Lesbian",
		"M" : "Married",
		"O" : "Other",
		"Lesbian" : "L",
		"Married" : "M",
		"Other" : "O"
};

CONFIGURATION.CHANGE_PASSWORD_RESPONSE = {
		"ERROR": "error",
		"NO_EMAIL": "no-email",
		"SENT": "sent",
};

CONFIGURATION.URL_REDIRECT_LOCAL_STORAGE = [
	"",
	CONFIGURATION.WEBPAGES.LOGIN,
	
];

CONFIGURATION.URL_WO_LOCAL_STORAGE = [
	CONFIGURATION.WEBPAGES.CREATE_ACCOUNT
];

CONFIGURATION.COUPLE_VISIBILITY = {
	"V": true,
	"N": false,
};

CONFIGURATION.INPUT_REQUIRED = {
	"PARTNER" : {
		"CREATE": [
			"username",
			"password",
			"emailAddress"
		],
		"UPDATE": [
			"firstName",
			"lastName",
			"gender",
			"age",
			"zipcode",
			"race"
		]
	},
	"COUPLE": {
		"UPDATE":  [
			"numChildren",
			"timeTogether",
			"relationshipType",
		]
	}
};

CONFIGURATION.VALIDATION_MESSAGES = {
		"CREATE_ACCOUNT": [
			
		],
		"LOGIN": [
			
		],
};

CONFIGURATION.INPUT_HARD_CODED = {
	"CREATE_ACCOUNT": [
		"username",
		"password",
		"emailAddress"		
	],
	"UPDATE_PARTNER": [
		"firstName",
		"middleName",
		"lastName",
		"age",
		"phoneNumber",
		"emailAddress",
		"address",
		"city",
		"state",
		"zipcode",
	],
	"UPDATE_COUPLE": [
		"numChildren",
		"story"
	],
};

CONFIGURATION.INPUT_HIDDEN = {
	"UPDATE_COUPLE": [
		"childrenAtHome",
		"oldestChild",
		"youngestChild",
	],
};

CONFIGURATION.ILLEGAL_CHARS = {
	"USERNAME": [" ", "'", "\\", "\"", "`"]
};

CONFIGURATION.DEFAULTS = {
		"maritalStatuses":[
			"Married",
			"Unmarried"
		],
		"relationshipTypes":{
			"Lesbian": "L",
			"Married": "M",
			"Other": "O"
		},
		"phoneNumber" : "XXX-XXX-XXXX"
};

CONFIGURATION.APPROVE_STATUS = {
		"APPROVED": "approve",
		"DECLINED": "decline",
		"MIXED": "mixed",
		"ONE_YES": "plus",
		"ONE_NO": "minus",
		"NO_VOTES": "none"
};


CONFIGURATION.FIELDS_NOT_IN_UPDATE_COUPLE = [
	"partnerHigher",
	"partnerLower"
];


CONFIGURATION.RETURN_TO_PROFILE_BEHAVES_DIFFERENTLY = [
	CONFIGURATION.WEBPAGES.UPDATE_PARTNER,
	CONFIGURATION.WEBPAGES.UPDATE_COUPLE,
	CONFIGURATION.WEBPAGES.SURVEY
];

CONFIGURATION.USA_STATES = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
];


CONFIGURATION.RECOMMENDED_COUPLES_DISPLAY = {
	"LIST":[
		{"timeTogether": "Time Together"},
		{"relationshipType": "Relationship Type"},
		{"numChildren": "Number of Children"},
		{"childrenAtHome": "Children at Home"},
	],
	"COUPLE": [
		{"timeTogether": "Time Together"},
		{"story": "Story"},
		{"relationshipType": "Relationship Type"},
		{"numChildren": "Number of Children"},
		{"childrenAtHome": "Children at Home"},
		{"oldestChild": "Oldest Child Age"},
		{"youngestChild": "Youngest Child Age"}
	],
	"PARTNER": [
		{"gender": "Gender"},
		{"age": "Age"}
	]
};




//This freezes the above CONFIGURATION object so that it can't be changed by any other scripts
(function deepFreeze(obj) {
// Retrieve the property names defined on obj
var propNames = Object.getOwnPropertyNames(obj);
// Freeze properties before freezing self
propNames.forEach(function(name) {
  var prop = obj[name];
  // Freeze prop if it is an object
  if (typeof prop == 'object' && prop !== null)
    deepFreeze(prop);
});
// Freeze self (no-op if already frozen)
return Object.freeze(obj);
}(CONFIGURATION));

