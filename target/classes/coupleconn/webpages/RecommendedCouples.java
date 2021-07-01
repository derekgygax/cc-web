package com.coupleconn.webpages;

import com.coupleconn.data.Couple;
import com.coupleconn.data.JsonMatch;
import com.coupleconn.data.SearchParam;
import com.coupleconn.data.UnitedStates;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jtwig.web.servlet.JtwigRenderer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/recommended_couples")
public class RecommendedCouples extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RecommendedCouples() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> recommendedParameters = new HashMap<String, String>();
		recommendedParameters.put("orderpriority", "true");
		recommendedParameters.put("ismatch", "false");
		String allRecommended = new Api("matches", true, request).get(new String[0], recommendedParameters).get("text");

		ObjectMapper objectMapper = new ObjectMapper();
		ArrayList<JsonMatch> allRecommendedMatches = objectMapper.readValue(allRecommended, new TypeReference<ArrayList<JsonMatch>>(){});
		//As of now you have to go and retrieve the couple information for each match
		Couple firstRecommendedCouple = null;
		String nextRecommenedCouple = null;
		for(int i = 0; i < allRecommendedMatches.size(); i++) {
	    	JsonMatch match = allRecommendedMatches.get(i);
	    	match.couple = new Couple().get(match.awayCoupleId, request);
    		
    		if(i == 0) {
    			firstRecommendedCouple = match.couple;
    		}
	    	if(i + 1 != allRecommendedMatches.size()) {
		    	if(i == 0) {
		    		nextRecommenedCouple = allRecommendedMatches.get(i + 1).awayCoupleId;
		    	}
	    	}
		}

		/* SEARCH DATA */
		String searchParamsStr = new Api("search/parameters", true, request)
				.get(new String[0], new HashMap<String, String>())
				.get("text");
		
		ArrayList<SearchParam> searchParams = objectMapper
				.readValue(searchParamsStr, new TypeReference<ArrayList<SearchParam>>(){});
		
		
		ArrayList<SearchParam> filteredSearch = new ArrayList<SearchParam>();
		String[] array = {"Age", "Max Distance", "Relationship type"};
		
		for(SearchParam searchParam : searchParams) {
			if(Arrays.asList(array).contains(searchParam.title)) {
				filteredSearch.add(searchParam);
			}
		}
		
		boolean userInCouple = Utils.userInCouple(request);
		
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("view", "overview");
		data.put("searchParams", filteredSearch);
		data.put("allRecommendedMatches", allRecommendedMatches);
		data.put("userInCouple", userInCouple);
		data.put("firstRecommendedCouple",  firstRecommendedCouple);
		data.put("nextRecommenedCouple",  nextRecommenedCouple);
		data.put("isMobile",  false);
		if(request.getHeader("User-Agent").indexOf("Mobile") != -1) {
		   data.put("isMobile",  true);
		}
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/recommended/recommended_base.twig.html");
		request.setAttribute("data", data);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}
