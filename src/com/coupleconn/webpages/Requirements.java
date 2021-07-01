package com.coupleconn.webpages;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.coupleconn.data.CoupleRequestsJson;
import com.coupleconn.data.SurveyAll;
import com.coupleconn.data.SurveyGroup;
import com.coupleconn.data.SurveyOverview;
import com.coupleconn.data.SurveyQuestion;
import com.coupleconn.util.Api;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class Requirements
 */
@WebServlet("/requirements")
public class Requirements extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Requirements() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// Get survey data
		SurveyAll surveyAll = new SurveyAll(request);
		// Get the overview review. Limit to the things you need
		SurveyOverview surveyOverview = surveyAll.getEssentialsOverview();
		// Get the survey questions for the groups you need
		HashMap<String, ArrayList<SurveyQuestion>> survey = surveyAll.getEssentialGroups();
		ArrayList<HashMap<String, String>> importance = surveyAll.getImportances();
		
		// Get Couple Up Requests
		String coupleUpRequestsString = new Api("create-couple", true, request).get(new String[0], new HashMap<String, String>()).get("text");
		ObjectMapper coupleObjectMapper = new ObjectMapper();
		CoupleRequestsJson coupleUpRequests = coupleObjectMapper.readValue(coupleUpRequestsString, new TypeReference<CoupleRequestsJson>(){});

		
		// Get Couple categorical questions
		ObjectMapper omcc = new ObjectMapper();
		String coupleCategoricalQuestionsString = new Api("categorical", true, request).get(new String[]{"couple"}, new HashMap<String, String>()).get("text");
		ArrayList<SurveyQuestion> coupleCategoricalQuestions = omcc.readValue(coupleCategoricalQuestionsString, new TypeReference<ArrayList<SurveyQuestion>>(){});
		
		// Get Partner categorical questions
		ObjectMapper ompc = new ObjectMapper();
		String partnerCategoricalQuestionsString = new Api("categorical", true, request).get(new String[]{"partner"}, new HashMap<String, String>()).get("text");
		ArrayList<SurveyQuestion> partnerCategoricalQuestions = ompc.readValue(partnerCategoricalQuestionsString, new TypeReference<ArrayList<SurveyQuestion>>(){});
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("surveyOverview", surveyOverview);
		data.put("survey", survey);
		data.put("importance", importance);
		data.put("coupleCategoricalQuestions", coupleCategoricalQuestions);
		data.put("partnerCategoricalQuestions", partnerCategoricalQuestions);
		data.put("coupleUpRequests", coupleUpRequests);
		
	
		// Set the attributes that will be read in the filter where the rendering will occur
		if (request.getParameterMap().containsKey("onlycontent")){
			request.setAttribute("template", "/WEB-INF/templates/requirements/content.html");
		} else {
			request.setAttribute("template", "/WEB-INF/templates/requirements/base.html");
		}
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
