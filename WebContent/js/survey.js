"use strict";


let SURVEY = function(){
	return {
		questionAnswers: {},
		
		addAnswer: function(questionId, answer, groupId){
			if (!this.questionAnswers.hasOwnProperty(groupId)){
				this.questionAnswers[groupId] = {};
			}
			this.questionAnswers[groupId][questionId] = answer;
			if (this.getNumAnswered() == 1){
				let path = location.pathname;
				if (path != CONFIGURATION.WEBPAGES.REQUIREMENTS) {
					this.submitAnswers(false);
				}
			}
		},
		
		getNumAnswered: function(){
			let numAnswered = 0;
			for (let group in this.questionAnswers){
				for (let questionId in this.questionAnswers[group]){
					numAnswered += 1;
				}
			}
			return numAnswered;
		},
		
		showConfirmation: function(){
			var button = $("#saveAnswers");
			button.removeClass("light-blue");
			button.text("Personality Saved");
			button.addClass("green");
			
			$(button).parent().find('input');
			
			setTimeout(function(){
				button.addClass("light-blue");
				button.text("Update Personality");
				button.removeClass("green");
			}, 2000);
		},
		
		submitAnswers: function(useBeacon){
			let _this = this;
			let answerResponseFn = function(rStatus, surveyOverviewStr){
				if (rStatus == 200){
					// Update the number of questions answered for each survey group
					_this.showConfirmation();
					_this.updateNumberAnswered(JSON.parse(surveyOverviewStr));
				} else {
					//TODO
//				DO SOMETHING!!
					
				}
			}
			
			// IF there are no answers then return
			if (this.getNumAnswered() == 0){
				return false;
			}
			
			$("#saveAnswers").text("Saving Personality");

			let answers = {};
			for (let groupId in this.questionAnswers){
				if (!answers.hasOwnProperty(groupId)){
					answers[groupId] = [];
				}
				for (let questionId in this.questionAnswers[groupId]){
					answers[groupId].push(this.questionAnswers[groupId][questionId]);
				}
			}
			// Clear the object
			for (let groupId in this.questionAnswers){
				delete this.questionAnswers[groupId];
			}
			// If there are no answers don't submit this
			let numSubmiting = 0;
			for (let groupId in answers){
				for (let questionId in answers[groupId]){
					numSubmiting += 1;
				}
			}
			if (numSubmiting > 0){
				let partner = Object.create(Partner);
				partner.answerSurvey(answers, answerResponseFn, useBeacon);
			}
		},
		
		updateNumberAnswered: function(surveyOverview){
			let surveyGroups = surveyOverview.groups;
			for (var i=0; i < surveyGroups.length; i++){
				let group = surveyGroups[i];
				let $groupNode = $(".survey_group[data-group_id='"+group.id+"']");
				// Check that the page has the group node
				// The requirements page will not so this is important to do
				if ($groupNode.length > 0){
					$groupNode.find(".num_answered").text(group.numAnswered);
					$groupNode.find(".num_questions").text(group.numQuestions);
				}
			}
		},
		
	}
}();

window.onload = function(){
	
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
					"importance": importance,
			};
			
			SURVEY.addAnswer(questionId, answer, groupId);
		}
	}
	
	$("body").on("click", ".slider-labels li", function() {
		var parent = $(this).parent().parent();
		var parent_slider = $(parent).find(".slider")[0];
		var slider_index = $(this).index();
		parent_slider.noUiSlider.set(slider_index);
		highlightLabel(parent, slider_index);
	});
	
	$('.collapsible').collapsible();
	
	$("body").on("click", "#saveAnswers", function(){
		SURVEY.submitAnswers(false);
		SURVEY.showConfirmation();
	});
	
	$("body").on("click", ".groupTitle", function(e){
		let $questionsNode = $(this).siblings(".questions");
		if ($questionsNode.is(":visible")){
			$questionsNode.hide();
		} else {
			$questionsNode.show();
		}
	});
	
	$("body").on("click", "input[type=radio]", function(e){
		recordAnswer(this);
	});
	
	$("body").on("click", ".survey_group", function(e) {
		var icon = $(this).find("i");
		
		if(icon.text() == "arrow_drop_up") {
			$(this).find("i").text("arrow_drop_down");
		} else {
			$(this).find("i").text("arrow_drop_up");
		}
	});
	
	
	// Timeout answering the questions
	// In case the user walks away and forgets to submit their answers
	setTimeout(function(){
		if ($("#surveyForm").length > 0){
			SURVEY.submitAnswers(false);
		}
	}, 600000)
};



window.addEventListener('beforeunload', function(event){
	if ($("#surveyForm").length > 0){
		SURVEY.submitAnswers(true);
	}
});
