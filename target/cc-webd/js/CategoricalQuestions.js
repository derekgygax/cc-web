let CategoricalQuestions = {
//	questions
//	type
//	requiredFields
	setup: function(type){
		this.type = type;
		this.requiredFields = CONFIGURATION.INPUT_REQUIRED[type.toUpperCase()]["UPDATE"];
	},
	
	Question: {
//		id
//		text
//		currentValue
//		choices
//		dropDown
		setup : function(groupInfo){
			for (let key in groupInfo){
				this[key] = groupInfo[key];
			}
		},
		
		buildNode: function(parentNode, requiredFields){
			// Row for question
			let rowDiv = CommonFunctions.getEl("div");
			rowDiv.id = "catq_" + this.id;
			
			// Label column for question
			let labelDiv = CommonFunctions.getEl("div");
			labelDiv.classList.add("inlineBlock");
			let labelNode = CommonFunctions.getEl("label");
			CommonFunctions.addEl(labelNode, CommonFunctions.getTn(this.text));
			CommonFunctions.addEl(labelDiv, labelNode);
			CommonFunctions.addEl(rowDiv, labelDiv);
			
			// Choices for question
			let choicesDiv = CommonFunctions.getEl("div");
			choicesDiv.classList.add("alignLeft", "inlineBlock");
			let dropDown = CommonFunctions.getEl("select");
			dropDown.id = this.id;
			// this.dropDown to be used for value extraction in each use of this object
			this.dropDown = dropDown;
			// Add a blank row to the dropDown
			// FIND A BETTER WAY TO HANDLE THIS!!!!
			CommonFunctions.addEl(dropDown, CommonFunctions.addEl(CommonFunctions.getEl('option'), CommonFunctions.getTn("")));
			for (let iO=0; iO < this.choices.length; iO++){
				let opt = this.choices[iO];
				let optNode = CommonFunctions.addEl(CommonFunctions.getEl("option"), CommonFunctions.getTn(opt.text));
//				YOU ARE SAVING THE TEXT AS THE VALUE!!
//				IDK IF THIS IS WHAT YOU WANT IN THE END!!
				optNode.value = opt.text;
				CommonFunctions.addEl(dropDown, optNode);
			}
			// Mark if required
			if (requiredFields.indexOf(this.id) > -1){
				labelNode.classList.add("inputRequired");
				dropDown.required = true;
			}
			CommonFunctions.addEl(choicesDiv, dropDown);
			CommonFunctions.addEl(rowDiv, choicesDiv);
			
			CommonFunctions.addEl(parentNode, rowDiv);
		}
		
	},

	buildQuestions: function(catQuestions, parentNode) {
		this.questions = [];
		for (let iQ=0; iQ < catQuestions.length; iQ++){
			let question = Object.create(this.Question);
			question.setup(catQuestions[iQ]);
			question.buildNode(parentNode, this.requiredFields);
			this.questions.push(question);
		}
	},
	
	setChoices: function(dataObj){
		for (let iCQ=0; iCQ < this.questions.length; iCQ++){
			let cq = this.questions[iCQ];
			let cqChoice = dataObj[cq.id];
			if (cqChoice && cqChoice != "null"){
				cq.dropDown.value = dataObj[cq.id];
			}
		}
	},
	
	getChoices: function(){
		let catChoices = {};
		for (let iC=0; iC < this.questions.length; iC++){
			let cq = this.questions[iC];
			let cqChoice = cq.dropDown.value;
			catChoices[cq.id] = cqChoice;
		}
		return catChoices;
	},
	
	hideQuestions: function(){
		this.hideOrShowQuestions("hide");
	},
	
	showHiddenQuestion: function(){
		this.hideOrShowQuestions("show");
	},
	
	hideOrShowQuestions: function(hideOrShow){
		let hiddenQsIds = CONFIGURATION.INPUT_HIDDEN["UPDATE_"+this.type.toUpperCase()];
		for (let iQ=0; iQ < hiddenQsIds.length; iQ++){
			//TODO think about this. It's not important because there are so few!
			// I am doing it this way for a memory thing. So entire nodes aren't stored in the RAM
			let questionId = hiddenQsIds[iQ];
			if (hideOrShow == "hide"){
				document.getElementById("catq_" + questionId).classList.add("hiddenInput");
			} else {
				document.getElementById("catq_" + questionId).classList.remove("hiddenInput");
			}
		}
	}

};
