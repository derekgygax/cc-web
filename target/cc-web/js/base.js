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

});

// Give actions to the sliders
// Set the hidden input of the sliders
(function(){
	let sliders = $("body").find(".sliders");
	$.each(sliders, function(index, slider){
		console.log(slider);
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