package com.coupleconn.data;
import java.io.IOException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;

import com.coupleconn.data.Partner;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Couple {
	public String coupleId;
	public String partnerIdLower;
	public String partnerIdHigher;
	public String relationshipType;
	public String timeTogether;
	public String story;
	public String childrenAtHome;
	public String youngestChild;
	public String oldestChild;
	public Integer numChildren;
	public HashMap<String, PartnerJson> partners;
	public ArrayList<HashMap<String, String>> profilePictures;
	public Location location;
	public Integer maxDistance;
	
	public Couple() {
		this.partners = new HashMap<String, PartnerJson>();
		this.profilePictures = new ArrayList<HashMap<String, String>>();
	}
	
	public Couple(ResultSet rs) throws Exception {
		this();
		this.loadResultSet(rs);
	}
	
	public void loadResultSet(ResultSet rs) throws Exception{
		this.coupleId = rs.getString("ID");
		this.partnerIdLower = rs.getString("partner_ID_lower");
		this.partnerIdHigher = rs.getString("partner_ID_higher");
		this.relationshipType = rs.getString("relationship_type");
		this.timeTogether = rs.getString("time_together");
		this.story = rs.getString("story");
		this.childrenAtHome = rs.getString("children_at_home");
		this.youngestChild = rs.getString("youngest_child");
		this.oldestChild = rs.getString("oldest_child");
		this.numChildren = rs.getInt("num_children");
		float lat = Float.valueOf(rs.getString("lat"));
		float lon = Float.valueOf(rs.getString("lon"));
		this.location = new Location(lat,lon);
	}
	
	public Couple get(String coupleId, HttpServletRequest request){
		Couple couple = new Couple();
		try{
			ObjectMapper objectMapper = new ObjectMapper();
			String coupleString = new Api("couple", true, request).get(new String[]{coupleId}, new HashMap<String, String>()).get("text");
			couple = objectMapper.readValue(coupleString, Couple.class);
			if (couple.story != null){
				couple.story = Utils.escapeHTML(couple.story);
			}
		} catch (Exception e){
			e.printStackTrace();
		}
		return couple;
	}
	
	public HashMap getHashMap() throws JsonProcessingException{
		HashMap coupleMap = new HashMap();
		coupleMap.put("coupleId", this.coupleId);
		coupleMap.put("partnerIdLower", this.partnerIdLower);
		coupleMap.put("partnerIdHigher", this.partnerIdHigher);
		coupleMap.put("relationshipType", this.relationshipType);
		coupleMap.put("timeTogether", this.timeTogether);
		coupleMap.put("story", Utils.escapeHTML(this.story));
		coupleMap.put("childrenAtHome", this.childrenAtHome);
		coupleMap.put("youngestChild", this.youngestChild);
		coupleMap.put("oldestChild", this.oldestChild);
		coupleMap.put("numChildren", String.valueOf(this.numChildren));
		coupleMap.put("profilePictures", this.profilePictures);
		ObjectMapper locationOm = new ObjectMapper();
		coupleMap.put("location", locationOm.writeValueAsString(this.location));
		coupleMap.put("maxDistance", this.maxDistance);
		return coupleMap;
	}
		
	
	public void addPartner(String partnerId, Partner partner) {
		PartnerJson partnerJson = partner.generatePublicJson();
		this.addPartner(partnerId, partnerJson);
	}
	
	public void addPartner(String partnerId, PartnerJson partner) {
		this.partners.put(partnerId, partner);
	}
	
	public boolean isProfilePicSet(){
		if (this.profilePictures.get(0).get("native").equals("https://s3.amazonaws.com/coupleconn-static/img/default-user-image.png")){
			return false;
		} else {
			return true;
		}
	}
	
	public HashMap<String, Boolean> questionsAnswered(){
		HashMap<String, Boolean> unAnswered = new HashMap<String, Boolean>();
		if (Utils.valueNotSet(this.relationshipType)){
			unAnswered.put("relationshipType", true);
		}
		if (Utils.valueNotSet(this.timeTogether)){
			unAnswered.put("timeTogether", true);
		}
		if (this.numChildren != 0){
			if (Utils.valueNotSet(this.childrenAtHome)){
				unAnswered.put("childrenAtHome", true);
			}
			if (Utils.valueNotSet(this.youngestChild)){
				unAnswered.put("youngestChild", true);
			}
			if (Utils.valueNotSet(this.oldestChild)){
				unAnswered.put("oldestChild", true);
			}
		}
		return unAnswered;
	}
	
	@JsonIgnore
	public boolean isLocationSet(){
		float EPSILON = 0.001f;
		float defaultLat = 80.03818f;
		float defaultLon = 14.092176f;
		
		if (Math.abs(this.location.getLat() - defaultLat) < EPSILON
				&& Math.abs(this.location.getLon() - defaultLon) < EPSILON){
			return false;
		} else {
			return true;
		}
	}
	
	@JsonIgnore
	public boolean isActive(HttpServletRequest request) throws IOException {
		String activeFlagStr = new Api("couple-active", true, request).get(
				new String[]{this.coupleId},
				new HashMap<String, String>()
		).get("text");
		return Boolean.parseBoolean(activeFlagStr);
	}
	
	@JsonIgnore
	public void changeActive(HttpServletRequest request, String active) throws IOException {
		HashMap<String, String> activeFlag = new HashMap<String, String>();
		activeFlag.put("active", active);
		
		ObjectMapper om = new ObjectMapper();
		String changeActiveResponse = new Api("couple-active", true, request).post(
				new String[]{this.coupleId},
				om.writeValueAsString(activeFlag)
		).get("text");		
	}

}