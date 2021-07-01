package com.coupleconn.views;

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
@WebServlet("/recommended_couples/couple")
public class SingleCouple extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();

    /**
     * @see HttpServlet#HttpServlet()
     */
    public SingleCouple() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> recommendedParameters = new HashMap<String, String>();
		recommendedParameters.put("approve", "none");
		recommendedParameters.put("orderpriority", "true");
		String allRecommended = new Api("matches", true, request).get(new String[0], recommendedParameters).get("text");
		ObjectMapper objectMapper = new ObjectMapper();
		ArrayList<JsonMatch> allRecommendedMatches = objectMapper.readValue(allRecommended, new TypeReference<ArrayList<JsonMatch>>(){});
		//As of now you have to go and retrieve the couple information for each match

		Couple couple = null;
	    String nextRecommendedCouple = null;
		if(request.getParameter("couple") != null) {
			String coupleId = request.getParameter("couple");
			 for(int i = 0; i < allRecommendedMatches.size(); i++) {
			    	JsonMatch match = allRecommendedMatches.get(i);

			    	if(i + 1 != allRecommendedMatches.size()) {
			    		// Found the current Couple within our Recommened Matches
						if(match.awayCoupleId.equals(request.getParameter("couple"))) {
							JsonMatch nextMatch = allRecommendedMatches.get(i + 1);
							nextRecommendedCouple = nextMatch.awayCoupleId;
						}
					} else {
						// This one is the last one in recommened match array
					}
			    	//System.out.println(match.awayCoupleId);
			}
			 
			HashMap<String, Object> data = new HashMap<String, Object>();

			couple = new Couple().get(coupleId, request);
			data.put("couple", couple);
			data.put("nextRecommenedCouple", nextRecommendedCouple);

			request.setAttribute("template", "/WEB-INF/templates/recommended/couple.twig.html");
			request.setAttribute("data", data);
		}
		


	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}
