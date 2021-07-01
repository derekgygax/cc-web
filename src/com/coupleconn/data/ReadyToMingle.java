package com.coupleconn.data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.coupleconn.util.Utils;

public class ReadyToMingle {
	public HashMap<String, Object> needs = null;
	public boolean done = false;
	
	public ReadyToMingle(PartnerJson partner, Couple couple,  HttpServletRequest request) throws IOException{
		checkCoupleInfo(couple);
		checkPartnerInfo(partner);
		checkSurvey(request);
		// Mark if everything is done
		if (this.needs == null){
			this.done = true;
		}
	}
	
	private void checkCoupleInfo(Couple couple){
		if (couple == null || couple.coupleId == null){
			this.addToNeeds("coupleUp", "Need to couple up");
			return;
		}
		
		HashMap<String, Object> coupleUpdates = new HashMap<String, Object>();
		
		if (!couple.isProfilePicSet()){
			coupleUpdates.put("profilePic", "Need to set a profile pic");
		}
		
		if (Utils.valueNotSet(couple.story)){
			coupleUpdates.put("story", "Need to tell your story");
		}

		if (!couple.isLocationSet()){
			coupleUpdates.put("location", "Need to update location");
		}
		
		HashMap<String, Boolean> unAnsweredQuestions = couple.questionsAnswered();
		if (unAnsweredQuestions.size() > 0 ){
			coupleUpdates.put("categoricalQuestions", unAnsweredQuestions);
		}
		
		if (coupleUpdates.size() > 0){
			this.addToNeeds("couple", coupleUpdates);
		}
	}
	
	public void checkPartnerInfo(PartnerJson partner){
		HashMap<String, Object> partnerUpdates = new HashMap<String, Object>();
		
		// Check the name
		HashMap<String, Object> name = new HashMap<String, Object>();
		if (Utils.valueNotSet(partner.firstName)){
			name.put("firstName", "Need to supply a first name");
		}
		if (Utils.valueNotSet(partner.lastName)){
			name.put("lastName", "Need to supply a last name");
		}
		if (name.size() > 0){
			partnerUpdates.put("name", name);
		}
		
		// Check the age
		if (partner.age == 0){
			partnerUpdates.put("age", "Need to supply an age");
		}
		
		// Check the categorical questions
		HashMap<String, Boolean> unAnsweredQuestions = partner.questionsAnswered();
		if (unAnsweredQuestions.size() > 0){
			partnerUpdates.put("categoricalQuestions", unAnsweredQuestions);
		}
		
		// Check if any updates are needed
		if (partnerUpdates.size() > 0){
			this.addToNeeds("partner", partnerUpdates);
		}
	}
	
	public void checkSurvey(HttpServletRequest request) throws IOException{
		SurveyAll surveyAll = new SurveyAll(request);
		if (!surveyAll.completedEssentials()){
			this.addToNeeds("survey", "The survey essentials need to be answered");
		}
	}
	
	public void addToHashMap(HashMap<String, String> map, String key, String value){
		
	}
	
	public void addToNeeds(String key, Object value){
		if (this.needs == null){
			this.needs = new HashMap<String, Object>();
		}
		this.needs.put(key, value);
	}
	
}
