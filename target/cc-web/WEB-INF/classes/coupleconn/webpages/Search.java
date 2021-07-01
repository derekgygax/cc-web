package com.coupleconn.webpages;

import com.coupleconn.data.Couple;
import com.coupleconn.data.SearchParam;
import com.coupleconn.util.Api;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.jtwig.web.servlet.JtwigRenderer;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/search")
public class Search extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Search() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// If there is data in the request then a search has been performed

				
		if (request.getParameter("data") != null){

			
			String couplesStr = new Api("search", true, request)
					.get(new String[0], request.getParameter("data"))
					.get("text");
			
			String json = request.getParameter("data");

			HashMap<String,Object> parameters =
			        new ObjectMapper().readValue(json, HashMap.class);
			System.out.println(couplesStr);

		    
			ObjectMapper om = new ObjectMapper();
			ArrayList<Couple> couples = om.readValue(couplesStr, new TypeReference<ArrayList<Couple>>(){});
			
			HashMap<String, Object> searchResults = new HashMap<String, Object>();
			searchResults.put("couples", couples);
			
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("searchResults", searchResults);
			data.put("parameters", parameters);
			
			// Set the attributes that will be read in the filter where the rendering will occur
			request.setAttribute("template", "/WEB-INF/templates/search/search_base.twig.html");
			request.setAttribute("data", data);			
			return;
		} else {
			System.out.println("Hey null");
			ObjectMapper objectMapper = new ObjectMapper();
			String searchParamsStr = new Api("search/parameters", true, request)
					.get(new String[0], new HashMap<String, String>())
					.get("text");
			
			ArrayList<SearchParam> searchParams = objectMapper
					.readValue(searchParamsStr, new TypeReference<ArrayList<SearchParam>>(){});
			
			
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("searchParams", searchParams);
			
			// Set the attributes that will be read in the filter where the rendering will occur
			request.setAttribute("template", "/WEB-INF/templates/search/search_base.twig.html");
			request.setAttribute("data", data);
			return;
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 * fu derek
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println(request.getParameter("data"));
		System.out.println("Hey");

		String json = request.getParameter("data");

		HashMap<String,Object> parameters =
		        new ObjectMapper().readValue(json, HashMap.class);
		
		String couplesStr = new Api("search", true, request)
				.get(new String[0], request.getParameter("data"))
				.get("text");
		ObjectMapper om = new ObjectMapper();
		ArrayList<Couple> couples = om.readValue(couplesStr, new TypeReference<ArrayList<Couple>>(){});
		
		HashMap<String, Object> searchResults = new HashMap<String, Object>();
		searchResults.put("couples", couples);
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("searchResults", searchResults);
		data.put("parameters", parameters);
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/search/search_results.html");
		request.setAttribute("data", data);			
		return;
	}

}
