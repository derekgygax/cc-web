package com.coupleconn.webpages;

import com.coupleconn.data.Couple;
import com.coupleconn.data.CoupleRequestsJson;
import com.coupleconn.data.JsonMatch;
import com.coupleconn.data.Partner;
import com.coupleconn.data.PartnerJson;
import com.coupleconn.data.SurveyQuestion;
import com.coupleconn.data.UnitedStates;
import com.coupleconn.util.Api;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import org.jtwig.web.servlet.JtwigRenderer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.ListIterator;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/profile")
public class Profile extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Profile() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		ObjectMapper objectMapper = new ObjectMapper();
		HashMap<String, Object> data = new HashMap<String, Object>();
		//Get categorical questions
		String categoricalQuestionsString = new Api("categorical", true, request).get(new String[]{"partner"}, new HashMap<String, String>()).get("text");
		ArrayList<SurveyQuestion> categoricalQuestions = objectMapper.readValue(categoricalQuestionsString, new TypeReference<ArrayList<SurveyQuestion>>(){});;
		String categoricalCoupleQuestionsString = new Api("categorical", true, request).get(new String[]{"couple"}, new HashMap<String, String>()).get("text");
		ArrayList<SurveyQuestion> categoricalCoupleQuestions = objectMapper.readValue(categoricalCoupleQuestionsString, new TypeReference<ArrayList<SurveyQuestion>>(){});
		//Get partner data
		HttpSession session = request.getSession(false);
		HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
		Partner partner = new Partner().get(userLoggedIn.get("partnerId"), request);
		
		Couple couple = null;
		PartnerJson partnerHigher = null;
		PartnerJson partnerLower = null;
		HashMap coupleResponse = new HashMap();
	
		String referer = null;
		if(request.getHeader("referer") != null) {
			if(request.getHeader("referer").contains("recommended_couples")) {
				referer = "recommended_couples";
			} else if(request.getHeader("referer").contains("matches")) {
				referer = "matches";
			}
		}

		//Get couple data
		if(userLoggedIn.get("coupleId") != null) {
			couple = new Couple().get(userLoggedIn.get("coupleId"), request);
			if(request.getParameter("couple") != null) {
				String coupleId = request.getParameter("couple");

				couple = new Couple().get(coupleId, request);
			}
			partnerHigher = couple.partners.get(couple.partnerIdHigher);
			partnerLower = couple.partners.get(couple.partnerIdLower);
			coupleResponse = couple.getHashMap();
		}
		
		String coupleUpRequestsString = new Api("create-couple", true, request).get(new String[0], new HashMap<String, String>()).get("text");
		ObjectMapper coupleObjectMapper = new ObjectMapper();
		CoupleRequestsJson coupleUpRequests = coupleObjectMapper.readValue(coupleUpRequestsString, new TypeReference<CoupleRequestsJson>(){});
		



		if(userLoggedIn.get("coupleId") != null) {
			HashMap<String, String> recommendedParameters = new HashMap<String, String>();
			recommendedParameters.put("orderpriority", "true");
			recommendedParameters.put("ismatch", "false");
			String allRecommended = new Api("matches", true, request).get(new String[0], recommendedParameters).get("text");
//	    	System.out.println(allRecommended);
			ArrayList<JsonMatch> allRecommendedMatches = objectMapper.readValue(allRecommended, new TypeReference<ArrayList<JsonMatch>>(){});
			//As of now you have to go and retrieve the couple information for each match
	
		    
		    String nextRecommendedCouple = null;
		    for(int i = 0; i < allRecommendedMatches.size(); i++) {
		    	JsonMatch match = allRecommendedMatches.get(i);
	
				if(match.awayCoupleId.equals(request.getParameter("couple"))) {
					if(i + 1 != allRecommendedMatches.size()) {
						JsonMatch nextMatch = allRecommendedMatches.get(i + 1);
						nextRecommendedCouple = nextMatch.awayCoupleId;
					}
				}
		    	//System.out.println(match.awayCoupleId);

		    }
			data.put("nextRecommendedCouple", nextRecommendedCouple);
			data.put("allRecommendedMatches", allRecommendedMatches);
			
		}

		
		
		

		data.put("unitedStates", UnitedStates.getStatesNameCode());
		data.put("categoricalQuestions", categoricalQuestions);
		data.put("categoricalCoupleQuestions", categoricalCoupleQuestions);
		data.put("partner", partner.getAsHashMap());
		data.put("couple", coupleResponse);
		data.put("partnerHigher", partnerHigher);
		data.put("partnerLower", partnerLower);
		data.put("coupleUpRequests", coupleUpRequests);
		data.put("referer", referer);

		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/profile/profile.twig.html");
		request.setAttribute("data", data);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}
