package com.coupleconn.data;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class JsonMatch {
	public String awayCoupleId;
	public String approve;
	public String partnerApprove;
	public String coupleApprove;
	public Boolean isMatch;
	public String matchId;
	public Couple couple;
	@JsonIgnore 
	public ArrayList messages;
	
	public JsonMatch(){
		
	}
	
}
