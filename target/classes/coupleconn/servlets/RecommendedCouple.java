package com.coupleconn.servlets;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.data.Couple;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class RecommendedCouple
 */
@WebServlet("/recommended_couple")
public class RecommendedCouple extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RecommendedCouple() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ObjectMapper objectMapper = new ObjectMapper();
		HashMap<String, String> requestData = objectMapper.readValue(
				request.getParameter("data"), new TypeReference<HashMap<String, String>>(){}
		);
		
		String coupleId = requestData.get("coupleId");
		Couple couple = new Couple().get(coupleId, request);
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("view", "detail");
		data.put("couple", couple);
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/recommended/detailed.twig.html");
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
