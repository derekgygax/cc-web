package com.coupleconn.data;

import java.util.ArrayList;

public class SurveyQuestion {
	public String id;
	public String text;
	public ArrayList<SurveyChoice> choices;
	public Integer currentValue;
	public Integer currentImportance;
	
	public SurveyQuestion() {
		choices = new ArrayList<SurveyChoice>();
    }
	
	public boolean currentValueIsNotNull(){
		if (this.currentValue != null){
			return true;
		}else {
			return false;
		}
	}
}
