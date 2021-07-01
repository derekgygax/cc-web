package com.coupleconn.data;

import java.util.ArrayList;

public class SurveyGroup {
	public String id;
	public String title;
	public String description;
	public int numQuestions;
	public int numAnswered;
	public ArrayList<SurveyQuestion> questions;
	
	public SurveyGroup(){
		this.questions = new ArrayList<SurveyQuestion>();
	}
}
