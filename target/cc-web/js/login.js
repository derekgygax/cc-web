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
			$(thisForm.elements['username']).parent().find('.helper-text').attr('data-success', "Login Successful");

			window.location.href = CONFIGURATION.WEBPAGES.PROFILE
		} else if (responseStatus == 401){
			//alert(responseText);
			console.log(responseText);

			$(thisForm.elements['username']).addClass('invalid');
			$(thisForm.elements['username']).parent().find('.helper-text').attr('data-error', responseText);
			$(thisForm.elements['password']).addClass('invalid');
			
			//thisForm.elements['password'].value = "";
			//$(thisForm.elements['username']).focus();
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
