package com.coupleconn.webpages;

import com.coupleconn.data.Couple;
import com.coupleconn.data.JsonMatch;
import com.coupleconn.data.Partner;
import com.coupleconn.data.PartnerJson;
import com.coupleconn.data.SurveyQuestion;
import com.coupleconn.data.UnitedStates;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import org.jtwig.web.servlet.JtwigRenderer;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/profile/update")
public class UpdatePartner extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UpdatePartner() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		ObjectMapper objectMapper = new ObjectMapper();
		//Get categorical questions
		String categoricalQuestionsString = new Api("categorical", true, request).get(new String[]{"partner"}, new HashMap<String, String>()).get("text");
		ArrayList<SurveyQuestion> categoricalQuestions = objectMapper.readValue(categoricalQuestionsString, new TypeReference<ArrayList<SurveyQuestion>>(){});

		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("unitedStates", UnitedStates.getStatesNameCode());
		data.put("categoricalQuestions", categoricalQuestions);
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/update_partner/update_partner.twig.html");
		request.setAttribute("data", data);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> requestParams = Utils.getRequestParams(request);
		HashMap<String, String> userLoggedIn = Utils.getLoggedInInfo(request, response);

		String apiResponse = new Api(requestParams.get("servlet"), true, request).post(
				new String[]{userLoggedIn.get("partnerId")}, 
				requestParams.get("data")).get("text");
		Partner partner = new Partner().get(userLoggedIn.get("partnerId"), request);
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("partner", partner.getAsHashMap());
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/update_partner/partner_display.twig.html");
		request.setAttribute("data", data);
	}

}
