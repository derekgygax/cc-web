package com.coupleconn.data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.coupleconn.util.Api;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SurveyAll {
	private static final List<String> suveryEssentialsGroupIds = Arrays.asList("Essential");
	HttpServletRequest request;
	
	public SurveyAll(HttpServletRequest request){
		this.request = request;
	}
	
	public SurveyOverview getOverview() throws IOException{
		ObjectMapper objectMapper = new ObjectMapper();
		// Gets all the questions in all the groups
		String overviewString = new Api("survey", true, this.request).get(new String[0], new HashMap<String,String>()).get("text");
		SurveyOverview overview = objectMapper.readValue(overviewString, new TypeReference<SurveyOverview>(){});
		return overview;
	}
	
	public SurveyOverview getEssentialsOverview() throws IOException{
		SurveyOverview everything = getOverview();
		SurveyOverview essentials = new SurveyOverview();
		for (SurveyGroup group: everything.groups){
			if (suveryEssentialsGroupIds.contains(group.id)){
				essentials.groups.add(group);
			}
		}
		return essentials;
	}
	
	public HashMap<String, ArrayList<SurveyQuestion>> getAllQuestions() throws IOException{
		return requestGetGroups(
			new String[0], 
			new HashMap<String,String>()
		);
	}
	
	public HashMap<String, ArrayList<SurveyQuestion>> getEssentialGroups() throws IOException{
		return getQuestionsInGroups(suveryEssentialsGroupIds);
	}
	
	public HashMap<String, ArrayList<SurveyQuestion>> getQuestionsInGroups(List<String> groups) throws IOException{
		HashMap<String, String> parameters = new HashMap<String, String>();
		parameters.put("group", String.join(",", groups));
		return requestGetGroups(
			new String[0], 
			parameters
		);
	}
	
	public HashMap<String, ArrayList<SurveyQuestion>> requestGetGroups(String[] urlExtensions, HashMap<String, String> requestParams) throws IOException{
		ObjectMapper om = new ObjectMapper();
		String surveyString = new Api("survey/qa", true, this.request).get(
			urlExtensions, 
			requestParams
		).get("text");
		HashMap<String, ArrayList<SurveyQuestion>> survey = om.readValue(
			surveyString, 
			new TypeReference<HashMap<String, ArrayList<SurveyQuestion>>>(){}
		);		
		return survey;		
	}
	
	public boolean completedEssentials() throws IOException{
		SurveyOverview overview = getEssentialsOverview();
		for (SurveyGroup group: overview.groups){
			if (group.numAnswered < group.numQuestions){
				return false;
			}
		}
		return true;
	}
	
	public ArrayList<HashMap<String, String>> getImportances(){
		//TODO
		// This is hardcoded!!!
		// You do NOT want that!!!
		// Kyle should be returning this!!!
		ArrayList<HashMap<String, String>> importance = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> lowStrength = new HashMap<String, String>();
		lowStrength.put("text", "Not at all");
		lowStrength.put("value", "0");
		HashMap<String, String> midStrength = new HashMap<String, String>();
		midStrength.put("text", "Somewhat");
		midStrength.put("value", "1");
		HashMap<String, String> highStrength = new HashMap<String, String>();
		highStrength.put("text", "A lot!");
		highStrength.put("value", "2");
		importance.add(lowStrength);
		importance.add(midStrength);
		importance.add(highStrength);
		return importance;
	}
}
