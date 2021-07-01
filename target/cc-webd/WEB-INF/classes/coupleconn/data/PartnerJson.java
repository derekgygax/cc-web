package com.coupleconn.data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import com.coupleconn.util.Utils;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)

public class PartnerJson {
	public String username;
	public String partnerId;
	public String firstName;
	public String middleName;
	public String lastName;
	public int age;
	public String zipcode;
	public String smoke;
	public String drink;
	public String politics;
	public String religion;
	public String gender;
	public String race;
	public String timeInArea;
	public String incomeRange;
	public String emailAddress;
	public String facebookId;
	public String phoneNumber;
	public String address;
	public String city;
	public String state;
	public boolean readyToMingle;
	public HashMap<String, Object> updatesNeeded;
	
	public PartnerJson() {
		
	}
	
	public PartnerJson(Partner partner) {
		this();
		this.username = partner.username;
		this.partnerId = partner.partnerId;
		this.firstName = partner.firstName;
		this.middleName = partner.middleName;
		this.lastName = partner.lastName;
		this.age = partner.age;
		this.zipcode = partner.zipcode;
		this.smoke = partner.smoke;
		this.drink = partner.drink;
		this.politics = partner.politics;
		this.religion = partner.religion;
		this.gender = partner.gender;
		this.race = partner.race;
		this.timeInArea = partner.timeInArea;
		this.incomeRange = partner.incomeRange;
		this.emailAddress = partner.emailAddress;
		this.facebookId = partner.facebookId;
		this.phoneNumber = partner.phoneNumber;
		this.city = partner.city;
		this.address = partner.address;
		this.state = partner.state;
	}
	
	public HashMap<String, String> getAsHashMap(){
		HashMap<String, String> partner = new HashMap<String, String>();
		partner.put("partnerId", this.partnerId);
		partner.put("firstName", this.firstName);
		partner.put("middleName", this.middleName);
		partner.put("lastName", this.lastName);
		partner.put("age", String.valueOf(this.age));
		partner.put("emailAddress", this.emailAddress);
		partner.put("facebookId", this.facebookId);
		partner.put("phoneNumber", this.phoneNumber);
		partner.put("address", this.address);
		partner.put("city", this.city);
		partner.put("state", this.state);
		partner.put("zipcode", this.zipcode);
		partner.put("smoke", this.smoke);
		partner.put("drink", this.drink);
		partner.put("politics", this.politics);
		partner.put("religion", this.religion);
		partner.put("gender", this.gender);
		partner.put("race", this.race);
		partner.put("timeInArea", this.timeInArea);
		partner.put("incomeRange", this.incomeRange);
		return partner;		
	}
	
	public HashMap<String, Object> getAsHashObject(){
		HashMap<String, Object> partner = new HashMap<String, Object>();
		partner.put("username", this.username);
		partner.put("partnerId", this.partnerId);
		partner.put("firstName", this.firstName);
		partner.put("middleName", this.middleName);
		partner.put("lastName", this.lastName);
		partner.put("age", this.age);
		partner.put("zipcode", this.zipcode);
		partner.put("smoke", this.smoke);
		partner.put("drink", this.drink);
		partner.put("politics", this.politics);
		partner.put("religion", this.religion);
		partner.put("gender", this.gender);
		partner.put("race", this.race);
		partner.put("timeInArea", this.timeInArea);
		partner.put("incomeRange", this.incomeRange);
		partner.put("emailAddress", this.emailAddress);
		partner.put("phoneNumber", this.phoneNumber);
		partner.put("address", this.address);
		partner.put("city", this.city);
		partner.put("state", this.state);
		partner.put("readyToMingle", this.readyToMingle);
		partner.put("updatesNeeded", this.updatesNeeded);
		return partner;
	}
	
	public void setReadyToMingle(Couple homeCouple, HttpServletRequest request) throws IOException {
		ReadyToMingle rtm = new ReadyToMingle(this, homeCouple, request);
		this.readyToMingle = rtm.done;
		this.updatesNeeded = rtm.needs;
	}
	
	public HashMap<String, Boolean> questionsAnswered(){
		HashMap<String, Boolean> unAnswered = new HashMap<String, Boolean>();
		if (Utils.valueNotSet(this.gender)){
			unAnswered.put("gender", true);
		}
		return unAnswered;
	}
}
