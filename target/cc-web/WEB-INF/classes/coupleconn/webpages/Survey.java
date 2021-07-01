package com.coupleconn.webpages;

import com.coupleconn.data.SurveyAll;
import com.coupleconn.data.SurveyGroup;
import com.coupleconn.data.SurveyOverview;
import com.coupleconn.data.SurveyQuestion;
import com.coupleconn.data.UnitedStates;
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

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/survey")
public class Survey extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Survey() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		SurveyAll surveyAll = new SurveyAll(request);
		SurveyOverview surveyOverview = surveyAll.getOverview();
		HashMap<String, ArrayList<SurveyQuestion>> survey = surveyAll.getAllQuestions();
		ArrayList<HashMap<String, String>> importance = surveyAll.getImportances();
		
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("surveyOverview", surveyOverview);
		data.put("survey", survey);
		data.put("importance", importance);
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/survey/survey.twig.html");
		request.setAttribute("data", data);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> requestParams = Utils.getRequestParams(request);
		String apiResponse = new Api(requestParams.get("servlet"), true, request).post(
						requestParams.get("path_extensions"),
						requestParams.get("data")).get("text");
		SurveyAll surveyAll = new SurveyAll(request);
		SurveyOverview surveyOverview = surveyAll.getOverview();
		
		ObjectMapper om = new ObjectMapper();
		response.getWriter().write(om.writeValueAsString(surveyOverview));
	}

}
