$("body").on("submit", "#loginForm", function(e){
	e.preventDefault();
	let partnerData = {};
	let thisForm = this;
	let processResponse = function(responseStatus, responseText){
		if (responseStatus == 200){
			//TODO
			// This probably shouldnt be here!!!
			//You want to do the redirect on the back end!!!
			$(thisForm.elements).last().removeClass("light-blue");
			$(thisForm.elements).last().addClass("green");
			$(thisForm.elements['emailAddress']).parent().find('.helper-text').attr('data-success', "Login Successful");

			window.location.href = CONFIGURATION.WEBPAGES.PROFILE
		} else if (responseStatus == 401){
			//alert(responseText);
			console.log(responseText);

			$(thisForm.elements['emailAddress']).addClass('invalid');
			$(thisForm.elements['emailAddress']).parent().find('.helper-text').attr('data-error', responseText);
			$(thisForm.elements['password']).addClass('invalid');
			
		}
	};
	
	let formElements = e.target.elements;
	for (let i=0; i < formElements.length; i++){
		let element = formElements[i];
		if (element.name){
			partnerData[element.name] = element.value;
		}
	}
	let partner = Object.create(Partner);
	partner.setup(partnerData);
	partner.login(processResponse);
});

$("body").on("submit", ".loginSelectForm", function(e){
	e.preventDefault();
	e.stopPropagation();
	var emailAddress = $(this).find("input[name='emailAddress']");
	var password = $(this).find("input[name='password']");
	var data = {'emailAddress': emailAddress.val(), 'password': password.val() };
	$.post( "/login-select", data, function( response, status ) {
			var response = JSON.parse(response);
			console.log(response);
		  if(response.status == "200") {
			  $(emailAddress).addClass("valid");
			  $(password).addClass("valid");
			  var emailAddressHelper = $(emailAddress).siblings(".helper-text");
			  $(emailAddressHelper).attr('data-success', 'Login successful');

			  window.location.replace("/profile");
		  } else {
			  $(emailAddress).addClass("invalid");
			  $(password).addClass("invalid");
			  var emailAddressHelper = $(emailAddress).siblings(".helper-text");
			  $(emailAddressHelper).attr('data-error', 'Login details incorrect.');
		  }
	});
	
});

