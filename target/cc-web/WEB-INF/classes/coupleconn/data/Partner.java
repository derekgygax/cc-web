package com.coupleconn.data;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import com.coupleconn.data.PartnerJson;
import com.coupleconn.util.Api;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Partner {
	public String partnerId;
	public String firstName;
	public String middleName;
	public String lastName;
	public int age;
	public String username;
	public String password_hash;
	public String salt;
	public String emailAddress;
	public String password; //enables using this class to create account
	public String facebookId;
	public String phoneNumber;
	public String address;
	public String city;
	public String state;
	public String zipcode;
	public String smoke;
	public String drink;
	public String politics;
	public String religion;
	public String gender;
	public String race;
	public String timeInArea;
	public String incomeRange;
	
	//TODO
	//Get rid of this
	public PartnerJson json;
	
	public Partner(){
		
	}
	
	
	public Partner get(String partnerId, HttpServletRequest request){
		Partner partner = new Partner();
		try{
			ObjectMapper objectMapper = new ObjectMapper();
			String partnerString = new Api("partner", true, request).get(new String[]{partnerId}, new HashMap<String, String>()).get("text");
			partner = objectMapper.readValue(partnerString, Partner.class);
		} catch (Exception e){
			e.printStackTrace();
		}
		return partner;
	}

	public PartnerJson generatePublicJson() {
		return new PartnerJson(this);
	}
	
	public HashMap<String, String> create(String data, HttpServletRequest request) throws IOException {
		HashMap<String, String> statusAndNewPartnerId = new Api("create-account", false, request).post(new String[0], data);
		return statusAndNewPartnerId;
	}
	
	public HashMap<String, String> getAsHashMap(){
		HashMap<String, String> partner = new HashMap<String, String>();
		partner.put("partnerId", this.partnerId);
		partner.put("firstName", this.firstName);
		partner.put("middleName", this.middleName);
		partner.put("lastName", this.lastName);
		partner.put("age", String.valueOf(this.age));
		partner.put("username", this.username);
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
	
}
