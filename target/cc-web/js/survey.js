"use strict";


let SURVEY = function(){
	return {
		questionAnswers: {},
		
		addAnswer: function(questionId, answer){
			this.questionAnswers[questionId] = answer;
			if (Object.keys(this.questionAnswers).length == 5){
				var path = location.pathname.substring(1);
				if(path != "cc-web/requirements") {
					this.submitAnswers(false);
				}
			}
		},
		
		submitAnswers: function(useBeacon){
			let _this = this;
			let answerResponseFn = function(rStatus, surveyOverviewStr){
				if (rStatus == 200){
					// Update the number of questions answered for each survey group
					_this.updateNumberAnswered(JSON.parse(surveyOverviewStr));
				} else {
					//TODO
//				DO SOMETHING!!
					
				}
			}
			
			// IF there are no answers then return
			if (Object.keys(this.questionAnswers).length == 0){
				return false;
			}
			
			let answers = [];
			for (let qId in this.questionAnswers){
				answers.push(this.questionAnswers[qId]);
			}
			// Clear the object
			for (let qId in this.questionAnswers){
				delete this.questionAnswers[qId]
			}
			// If there are no answers don't submit this
			if (answers.length > 0){
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
		// Only save the answer if both the choice and importance levels have been chosen
		if (choice && importance){
			let answer = {
					"questionID": questionId,
					"value": choice,
					"importance": importance,
			};
			
			SURVEY.addAnswer(questionId, answer);
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
	
	
	
	// Timeout answering the questions
	// In case the user walks away and forgets to submit their answers
	setTimeout(function(){
		SURVEY.submitAnswers(false);
	}, 600000)
};



window.addEventListener('beforeunload', function(event){
	SURVEY.submitAnswers(true);
});
