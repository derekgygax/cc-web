package com.coupleconn.webpages;

import com.coupleconn.data.Couple;
import com.coupleconn.data.Partner;
import com.coupleconn.data.PartnerJson;
import com.coupleconn.data.SurveyQuestion;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import org.jtwig.web.servlet.JtwigRenderer;

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
@WebServlet("/couple/update")
public class UpdateCouple extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UpdateCouple() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		ObjectMapper objectMapper = new ObjectMapper();
		//Get categorical questions
		String categoricalQuestionsString = new Api("categorical", true, request).get(new String[]{"couple"}, new HashMap<String, String>()).get("text");
		ArrayList<SurveyQuestion> categoricalQuestions = objectMapper.readValue(categoricalQuestionsString, new TypeReference<ArrayList<SurveyQuestion>>(){});
		
		//Get couple data
		HttpSession session = request.getSession(false);
		HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
		Couple couple = new Couple().get(userLoggedIn.get("coupleId"), request);	
		PartnerJson partnerHigher = couple.partners.get(couple.partnerIdHigher);
		PartnerJson partnerLower = couple.partners.get(couple.partnerIdLower);
		

		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("categoricalQuestions", categoricalQuestions);
		data.put("couple", couple.getHashMap());
		data.put("partnerHigher", partnerHigher);
		data.put("partnerLower", partnerLower);
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/update_couple/update_couple.twig.html");
		request.setAttribute("data", data);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		HashMap<String, String> requestParams = Utils.getRequestParams(request);
		HashMap<String, String> userLoggedIn = Utils.getLoggedInInfo(request, response);
		
		String apiResponse = new Api(requestParams.get("servlet"), true, request).post(
				new String[]{userLoggedIn.get("coupleId")}, 
				requestParams.get("data")).get("text");
		
		response.getWriter().write(apiResponse);
	}

}
