$( document ).ready(function() {
	  $('.dropdown-trigger').dropdown();
	  var elem = document.querySelector('.dropdown-trigger');
	  
	  $(".dropdown-trigger").each(function() {
		  var options = {
				  'alignment': 'right',
					//'hover': true,	  
				  };
		  var instance = M.Dropdown.init($(this), options);

	  });
	  var options = {
		'hover': true,	  
	  };
	  //var instance = M.Dropdown.init(elem, options);
	  $('.tooltipped').tooltip();
	  $('.tabs').tabs();
	  $('.sidenav').sidenav();
	  $('select').formSelect();
	  $('.modal').modal();
	  $('#tabs-swipe-demo').tabs({swipeable: true});
	  $('.collapsible').collapsible();
	
	   M.updateTextFields();
	   
	   $("body").on("click", ".couple_vert_menu", function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
	   });
	   
	   
	   $("body").on("submit", "#contactUsForm", function(e){
		  e.preventDefault();
		  var data = {};
		  
		 // console.log(e.target.submit());
		  let formElements = e.target.elements;
			for (let i=0; i < formElements.length; i++){
				let element = formElements[i];
				if (element.name){
					data[element.name] = element.value;
				}
			}
			
		  
		  $.ajax({
			    type: "POST",
			    url: "/contact",
			    data: data,
			    success: function (response) { 
			    	var button = $(".submitContactMessage");
					button.removeClass("light-blue");
					button.text("Message Sent");
					button.addClass("green");
					
					$(button).parent().find('input');
					
					setTimeout(function(){
						button.addClass("disabled");
					}, 2000);
			    },
			    error: function(message) {
			    	console.log(message);
			    }
			});
			
	   });
	   
	   $("body").on("click", ".collapsible-header", function(e) {
			var icon = $(this).find("i");
			
			if(icon.text() == "arrow_drop_up") {
				$(this).find("i").text("arrow_drop_down");
			} else {
				$(this).find("i").text("arrow_drop_up");
			}
		});
	   
		$(".nav-partner-circle").click(function(e) {
			var homePartner = $(this).attr("data-homepartnerid");
			var awayPartner = $(this).attr("data-awaypartnerid");
			
			if (awayPartner != null ) {
				$.ajax({
					type: "POST",
					url: "/login-select",
					data: null,
					success: function (response) {
						// You have switched users so go to the profile page
						window.location.replace("/profile");
					},
					error: function(message) {
						console.log(message);
					}
				});
			}

			if (homePartner != null ) {
				// Just going back to where you already were
				// Doing nothing
				window.location.replace("/profile");
			}
			
		});

});

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


(function($){
	$.fn.replace_html = function(html){
		return this.each(function(){
			var el = $(this);
			el.stop(true, true, false);
			var finish = {width: this.style.width, height: this.style.height};
			var cur = {width: el.width() + "px", height: el.height() + "px"};
			el.html(html);
			var next = {width: el.width() + "px", height: el.height() + "px"};
			el.css(cur).animate(next, 300, function(){el.css(finish);});
		});
	};
})(jQuery);