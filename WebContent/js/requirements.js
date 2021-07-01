$(document).ready(function(){

	// When you have successfully updated requirements on the page
	// then refresh the contents of the requirements
	let resetRequirements = function(localServlet){
			var showLoader = false;
			
			if(localServlet =='/profile/update') {
				var len = $("#updatePartnerForm").children(":visible").children(":visible").find("input:visible").length;
				var steps = $("#updatePartnerForm").children(":visible").children(":visible").find("input:visible");
				$(steps).each(function(){
					var name = $(this).attr("name");
					var val = $(this).val();
					if($(this).hasClass("select-dropdown")){
						var select = $(this).siblings("select");
						name = $(select).attr("name");
					}
					if(name == "gender" && len == 1) {
						if(val != "What is your gender?") {
							showLoader = true;
						}
					}
					if(name == "age" && len == 1) {
						if(val != 0) {
							showLoader = true;
						}
					}
				});
				if(showLoader == true) {
					$("#requirements").html('<div id="searchPreloader"><div class="progress"><div class="indeterminate"></div></div></div>');
				}
			} else if(localServlet =='/couple/update'){
				var len = $("#updateCoupleForm").children(":visible").children(":visible").find("input:visible").length;
				var steps = $("#updateCoupleForm").children(":visible").children(":visible").find("input:visible");
				var story = $("#updateCoupleForm").find("textarea[name='story']");
				var timeTogether = $("#updateCoupleForm").find("select[name='timeTogether']");
				var relationshipType = $("#updateCoupleForm").find("select[name='relationshipType']");
				var location = $("#updateCoupleForm").find("input[name='location']");
				if($(timeTogether).val() != "" && $(relationshipType).val() != "" && len == 1){
					showLoader = true;
				}

				if($(story).val() != "" && len == 1) {
					showLoader = true;
				}
				
				if($(location).val() != "" && len == 1) {
					showLoader = true;
				}
				if(showLoader == true) {
					$("#requirements").html('<div id="searchPreloader"><div class="progress"><div class="indeterminate"></div></div></div>');
				}
			} else {
				$("#requirements").html('<div id="searchPreloader"><div class="progress"><div class="indeterminate"></div></div></div>');		
			}
			$.ajax({
				type: "GET",
				url: "/requirements?onlycontent=true",
				success: function(requirementsNode){

					document.getElementById("requirements").innerHTML = requirementsNode;
					//console.log(requirementsNode);
					if($(requirementsNode).children().length == 0) {
						window.location.replace(CONFIGURATION.WEBPAGES.PROFILE);
					}
//					console.log(requirementsNode);
					// Stuff for materialize
					  $('.tooltipped').tooltip();
					  $('.tabs').tabs();
					  $('.sidenav').sidenav();
					  $('select').formSelect();
					  $('.modal').modal();
					  $('#tabs-swipe-demo').tabs({swipeable: true});
					  
					  var elem = document.querySelector('.collapsible');
					  if (elem){
						  var instances = M.Collapsible.init(elem, {});
						  var instance = M.Collapsible.getInstance(elem);
						  instance.open();
					  }
					  
					  let sliders = $(".slider");
					  sliders.each(function(index, slider) {
							var active_index = $(slider).parent().find(".slider-labels .active").index();
							
							noUiSlider.create(slider, {
							    start: active_index,
							    step: 1,
							    connect: "lower",
							    range: {
							      'min': 0,
							      'max': 2
							    },
							    format: wNumb({
							    	decimals: 0
							    }),
							    serialization: {
							      format: wNumb({
							      	decimals: 0
							      })
							    }
							 });
							
							slider.noUiSlider.on('set', function(){
								let val = slider.noUiSlider.get();
							    highlightLabel(this.target.parentElement, val);
							    recordAnswer(this.target);
							});
							
						});
					  changeRequirementProgress();
				},
				error: function(xhr, ajaxOptions, thrownError){
					console.log(xhr);
					console.log(ajaxOptions);
					console.log(thrownError);
				}
			});

	};
	
	let highlightLabel = function(parent_slider, $this) {
		$(parent_slider).find('.slider-labels .active').removeClass('active');
		var index = parseInt($this) + 1;
	    $(parent_slider).find('.slider-labels li:nth-child('+index+')').addClass('active');
	};
	
	let recordAnswer = function(node){
		let $questionNode = $(node).closest(".question");
		let questionId = $questionNode.attr("data-question-id")
		let choice = $questionNode.find("input[name="+questionId+"_choice]:checked").val();
		let importance = $questionNode.find(".slider")[0].noUiSlider.get();
		let groupId = $questionNode.closest(".survey_group").attr("data-group_id");
		// Only save the answer if both the choice and importance levels have been chosen
		if (choice && importance){
			let answer = {
					"questionID": questionId,
					"value": choice,
					"importance": importance
			};
			
			SURVEY.addAnswer(questionId, answer, groupId);
		}
	}
	
	let changeRequirementProgress = function() {
		
		if($("body").find(".partner_email_verified_card").length){
			var stage = $("#requirementsProgressBar").children().eq(0);
			$("#requirementsProgressBar li.active").removeClass("active");
			$(stage).addClass("active");
			return;
		}
		
		if($("body").find("#surveyForm").length) {
			var stage = $("#requirementsProgressBar").children().eq(1);
			$("#requirementsProgressBar li.active").removeClass("active");
			$(stage).addClass("active");
			return;
		}
		
		if($("body").find("#updateCoupleForm").length) {
			var stage = $("#requirementsProgressBar").children().eq(2);
			$("#requirementsProgressBar li.active").removeClass("active");
			$(stage).addClass("active");
			return;
		}
		
		if($("body").find(".uploadImagesForm").length){
			var stage = $("#requirementsProgressBar").children().eq(2);
			$("#requirementsProgressBar li.active").removeClass("active");
			$(stage).addClass("active");
			return;
		}
		
		var stage = $("#requirementsProgressBar").children().eq(0);
		$("#requirementsProgressBar li.active").removeClass("active");
		$(stage).addClass("active");
			
	};
	changeRequirementProgress();
	// Submitting the update couple form
	$("body").on("submit", "#requirementUpdateCoupleForm", function(e){
		e.preventDefault();
		let couple = Object.create(Couple);
		// Populate the couple with the form elements
		let elements = this.elements;
		for (let i = 0; i < elements.length; i++){
			if (elements[i].name){
				couple[elements[i].name] = elements[i].value;
			}
		}
		
		let responseFn = function(status, text){
			if (status == 200){
				resetRequirements();
			}
		}
		couple.updateInfo(responseFn);
	});
	
	
	$("body").on("submit", "#createCoupleRequirementForm", function(e) {
		e.preventDefault();
		var newPartner = $(this).serializeArray();
		var partner = {};
		newPartner.forEach(function(element) {
			partner[element.name] = element.value;
		});
		partner['gender'] = $("#createCoupleRequirementGender").val();
		console.log(partner);
		var errors = 0;
		
		if(!partner.firstName) {
			$("#createCoupleRequirementFirstName").addClass("invalid");
			$("#createCoupleRequirementFirstName").siblings(".helper-text").attr('data-error', 'Please provide a first name');
			errors++;
		}
		if(!partner.lastName) {
			$("#createCoupleRequirementLastName").addClass("invalid");
			$("#createCoupleRequirementLastName").siblings(".helper-text").attr('data-error', 'Please provide a last name');
			errors++;
		}
		
		var age = partner.age;
		if(age) {
			if(isNaN(parseInt(age))) {
				$("#createCoupleRequirementAge").addClass("invalid");
				$("#createCoupleRequirementAge").siblings(".helper-text").attr('data-error', 'Age must be a number');
				errors++;
			} else {
				age = parseInt(age);
			}
			if(age > 125) {
				$("#createCoupleRequirementAge").addClass("invalid");
				$("#createCoupleRequirementAge").siblings(".helper-text").attr('data-error', 'Please enter a realistic age');
				errors++;
			}
			if(age < 18) {
				console.log("Here");
				$("#createCoupleRequirementAge").addClass("invalid");
				$("#createCoupleRequirementAge").siblings(".helper-text").attr('data-error', 'You must be 18 years old or older');
				errors++;
			}
		} else {
			$("#createCoupleRequirementAge").addClass("invalid");
			$("#createCoupleRequirementAge").siblings(".helper-text").attr('data-error', 'You must enter an age');
		}
		
		var gender_option = $('#createCoupleRequirementGender').val();
		if(gender_option == "" || gender_option == null) {
			$("#createCoupleRequirementGender").siblings("input").addClass("invalid");
			$("#createCoupleRequirementGender").parent().siblings(".helper-text").attr('data-error', 'Please select a gender.');
			errors++;
		}
		
		if(errors === 0) {
    		$(".createCoupleRequirementFormButton").addClass("green");
    		$(".createCoupleRequirementFormButton").removeClass("light-blue");
    		
    		$.ajax({
    		    type: "POST",
    		    url: "/create-couple-requirement",
                data: JSON.stringify(partner),
    		    success: function(rText, textStatus, xhr){
    		    	resetRequirements();
    		    },
    		    error: function(xhr, ajaxOptions, thrownError){
    		    	console.log(xhr);
    		    	console.log(ajaxOptions);
    		    	console.log(thrownError);
    		    }
    		});   		
    		
    	}
	});
	
	// INTERCEPT THINGS!!
	$("body").on("submit", "#requirements .coupleUpForm", function(event){
		Requirements.startCall(event);
	});
	// INTERCEPT THINGS!!
	$("body").on("submit", "#requirements .uploadImagesForm", function(event){
		Requirements.startCall(event);
	});

	$("body").on("submit", "#requirements #updateCoupleForm", function(event){
		Requirements.startCall(event);
	});
	
	$("body").on("click", "#requirements #updateLocation", function(event){
		Requirements.startCall(event);
	});
	
	// The survey answering is a bit different
	$("body").on("click", "#requirements #saveAnswers", function(event){
		Requirements.startCall(event);
	});			
	$("body").on("click", "#requirements #updatePartnerForm button", function(event){
		Requirements.startCall(event);
	});
	
	let Requirements = {
			'servlets': [
				'/create_couple',
				'/images',
				'/couple/update',
				'/profile/update',
				'/survey',
			],
			pullTrigger: true,
			active: false,
			startCall: function(event){
				if (this.pullTrigger){
					this.pullTrigger = false;
					event.preventDefault();
					event.stopImmediatePropagation();
					$(event.target).trigger(event.type)
				} else {
					this.pullTrigger = true;
					this.active = true;
				}
			},
		};
	
	  
	  
	$(document).on("ajaxFinishedLoading", function(event, data){
		if (data.localServlet == CONFIGURATION.LOCAL_SERVLET.CREATE_COUPLE && data.xhr.status != 200){
			return false;
		}
		if (Requirements.active && Requirements.servlets.indexOf(data.localServlet) > -1){
			Requirements.active = false;
			if (data.localServlet == CONFIGURATION.WEBPAGES.SURVEY){
				let reset = true;
				let surveyOverview = JSON.parse(data.response);
				let surveyGroups = surveyOverview.groups;
				for (var i=0; i < surveyGroups.length; i++){
					let group = surveyGroups[i];
					if(group.id != "Essential") {
						continue;
					}
					let $groupNode = $(".survey_group[data-group_id='"+group.id+"']");
//					$groupNode.length > 0 checks if there were any results found
					if ($groupNode.length > 0){
						if (group.numAnswered != group.numQuestions){
							reset = false;
						}
					}
				}
				if (reset){
					resetRequirements(data.localServlet);	
				}
			} else {
				resetRequirements(data.localServlet);
			}
		} else {
			console.log("ignore this one");
		}
	});
});
