"use strict";

$("body").on("submit", "#searchModal #searchForm", function(e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	let formElements = e.target.elements;
	let data = {};
	for (let i=0; i < formElements.length; i++){
		let element = formElements[i];
		if (element.name){
			let value = null;
			if (element.classList.contains("multiselect")){
				value = $(element).val().join(",");
			} else {
				value = $(element).val();
			}
			if (value){
				data[element.name] = value;
			}
		}
	}
	console.log(encodeURIComponent(JSON.stringify(data)));
	var url = '/search?data='+encodeURIComponent(JSON.stringify(data));
	window.location = url;
});

$("body").on("submit", "#searchForm", function(e){
	e.preventDefault();
	let formElements = e.target.elements;
	let data = {};
	for (let i=0; i < formElements.length; i++){
		let element = formElements[i];
		if (element.name){
			let value = null;
			if (element.classList.contains("multiselect")){
				value = $(element).val().join(",");
			} else {
				value = $(element).val();
			}
			if (value){
				data[element.name] = value;
			}
		}
	}
	let processSearch = function(resultCouplesNode){
		document.getElementById("results").innerHTML = resultCouplesNode;
		  $('.dropdown-trigger').dropdown();

		$("#searchPreloader").remove();
	};
	if($("#searchCard").length > 0){
		var collapsibleSearch = M.Collapsible.getInstance($("#searchCard"));
		//collapsibleSearch.close();  

	}

	let partner = Object.create(Partner);
	partner.search(data, processSearch);
	var url = '/search?data='+encodeURIComponent(JSON.stringify(data));
	window.history.pushState({}, null, url);
	
	$("#results").html('<div id="searchPreloader"><div class="progress"><div class="indeterminate"></div></div></div>');

});
$("body").on("click", ".recommended_couple_header, .recommended_couple_info", function(){
	// If the user is clicking on Approve or Decline this don't retrieve the detail card
	if (document.activeElement.classList.contains("recommended_approve")){
		return false;
	}
	if (document.activeElement.classList.contains("couple_vert_menu")){
		return false;
	}
	var isDropdownActive = $(this).parent().find(".dropdown-content").css('opacity');
	if(isDropdownActive == 1) {
		return false;
	}
	console.log($(this).parent().find(".dropdown-content"));
	let couple = Object.create(Couple);
	couple.coupleId = this.parentElement.getAttribute("data-coupleid");
	
	// Total f*kin hack, but it saves 200+ lines of code
	window.location.href = "/profile?couple="+couple.coupleId;
	
	/*
	 * 	$(".marco").removeClass("l12");
	$(".marco").addClass("l4");
	$(".waldo").removeClass("l4");
	$(".waldo").addClass("l12");
	$(".polo").show();
	 * let addDetailedCouple = function(detailedCoupleHTML){
		let detailedCoupleNode = document.getElementById("recommendedDetailed");
		detailedCoupleNode.setAttribute("data-coupleid", couple.coupleId);
		detailedCoupleNode.innerHTML = detailedCoupleHTML;
		$('body').find('.tabs').tabs();
	};
	couple.getDetailCard(addDetailedCouple);*/
});
$(document).ready(function(){
	// Give actions to the sliders
	// Set the hidden input of the sliders
	(function(){
		let sliders = $("body").find(".sliders");
		$.each(sliders, function(index, slider){

			let paramId = slider.getAttribute("data-paramid");

			slider.noUiSlider.on('end', function(){
				let slideVals = slider.noUiSlider.get();
				$("#searchForm input[name="+paramId).val(slideVals.join(","));
			});
		});
	})();

	  $('.dropdown-trigger').dropdown();
	  $('select').formSelect();

	  if($("#searchCard").length > 0 ) {
		  var instance = M.Collapsible.getInstance($("#searchCard"));
	  	//instance.open();
	  }

});



