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
import com.coupleconn.data.UnitedStates;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class Messages
 */
@WebServlet("/messages")
public class Messages extends HttpServlet {
	private static final long serialVersionUID = 1L;
      
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Messages() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> recommendedParameters = new HashMap<String, String>();
		recommendedParameters.put("ismatch", "true");
		String allRecommended = new Api("matches", true, request).get(new String[0], recommendedParameters).get("text");
		ObjectMapper objectMapper = new ObjectMapper();
		ArrayList<JsonMatch> allMatches = objectMapper.readValue(allRecommended, new TypeReference<ArrayList<JsonMatch>>(){});
		//As of now you have to go and retrieve the couple information for each match
		for (JsonMatch match : allMatches) {
			match.couple = new Couple().get(match.awayCoupleId, request);
		}
		
		//Get home couple data
		HttpSession session = request.getSession(false);
		// TODO what if the session has timed out!!
		// Do you need to do anything
		HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
		Couple homeCouple = new Couple().get(userLoggedIn.get("coupleId"), request);
		boolean userInCouple = Utils.userInCouple(session);
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("userId", userLoggedIn.get("partnerId"));
		data.put("allMatches", allMatches);
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/messages/messages_base.twig.html");
		request.setAttribute("data", data);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
