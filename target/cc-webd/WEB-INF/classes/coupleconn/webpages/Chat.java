package com.coupleconn.webpages;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.data.Couple;
import com.coupleconn.data.JsonMatch;
import com.coupleconn.data.PartnerJson;
import com.coupleconn.util.Api;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class Chat
 */
@WebServlet("/chat")
public class Chat extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Chat() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> matchParameters = new HashMap<String, String>();
		matchParameters.put("ismatch", "true");
		String allRecommended = new Api("matches", true, request).get(new String[0], matchParameters).get("text");

		ObjectMapper objectMapper = new ObjectMapper();
		ArrayList<JsonMatch> allMatches = objectMapper.readValue(allRecommended, new TypeReference<ArrayList<JsonMatch>>(){});
		
		// This is for the future recommened couples
		HashMap<String, String> recommendedParameters = new HashMap<String, String>();
		recommendedParameters.put("orderpriority", "true");
		recommendedParameters.put("approve", "approve");
		recommendedParameters.put("partnerapprove", "approve");
		recommendedParameters.put("ismatch", "false");
		String allRecommendedCouplesStr = new Api("matches", true, request).get(new String[0], recommendedParameters).get("text");

		ArrayList<JsonMatch> allRecommendedCouples = objectMapper.readValue(allRecommendedCouplesStr, new TypeReference<ArrayList<JsonMatch>>(){});
		
		

		//As of now you have to go and retrieve the couple information for each match
		for (JsonMatch match : allMatches) {
			match.couple = new Couple().get(match.awayCoupleId, request);
		}
		HttpSession session = request.getSession(false);
		HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
		//As of now you have to go and retrieve the couple information for each match
		for (JsonMatch recommendedCouple : allRecommendedCouples) {
			recommendedCouple.couple = new Couple().get(recommendedCouple.awayCoupleId, request);
			recommendedCouple.matchId = userLoggedIn.get("coupleId")+"-"+recommendedCouple.awayCoupleId;
			allMatches.add(recommendedCouple);
		}
		
		
		// This is for a person without matching, find a message
		HashMap<String, String> futureMatchesParameters = new HashMap<String, String>();
		futureMatchesParameters.put("orderpriority", "true");
		futureMatchesParameters.put("ismatch", "false");
		String allCouplesStr = new Api("matches", true, request).get(new String[0], futureMatchesParameters).get("text");
		ArrayList<JsonMatch> allCouples = objectMapper.readValue(allCouplesStr, new TypeReference<ArrayList<JsonMatch>>(){});
		
		for (JsonMatch match : allCouples) {

			if(!match.coupleApprove.equals("decline")) {
				match.couple = new Couple().get(match.awayCoupleId, request);
				match.matchId = userLoggedIn.get("coupleId")+"-"+match.awayCoupleId;

				allMatches.add(match);
			}
			
		}
		
		
		ObjectMapper omToString = new ObjectMapper();
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("matches", omToString.writeValueAsString(allMatches));
		data.put("allMatches", allMatches);
		data.put("allRecommendedCouples", allRecommendedCouples);
		
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/chat/chat_base.twig.html");
		request.setAttribute("data", data);
	}

	private HashMap<String, Object> getDetailedUserInfo(HashMap<String, String> userLoggedIn, HttpServletRequest request){
		Couple homeCouple = new Couple().get(userLoggedIn.get("coupleId"), request);	
		PartnerJson homePartner = null;
		PartnerJson awayPartner = null;
		if (userLoggedIn.get("partnerId").equals(homeCouple.partnerIdHigher)){
			homePartner = homeCouple.partners.get(homeCouple.partnerIdHigher);
			awayPartner = homeCouple.partners.get(homeCouple.partnerIdLower);
		} else {
			homePartner = homeCouple.partners.get(homeCouple.partnerIdLower);
			awayPartner = homeCouple.partners.get(homeCouple.partnerIdHigher);
		}
		HashMap<String, Object> detailedInfo = new HashMap<String, Object>();
		detailedInfo.put("homeCouple", homeCouple);
		detailedInfo.put("homePartner", homePartner);
		detailedInfo.put("awayPartner", awayPartner);
		return detailedInfo;
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
