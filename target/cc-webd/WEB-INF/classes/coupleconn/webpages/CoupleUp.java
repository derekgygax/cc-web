package com.coupleconn.webpages;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.data.Couple;
import com.coupleconn.data.CoupleRequestsJson;
import com.coupleconn.data.JsonMatch;
import com.coupleconn.data.SearchParam;
import com.coupleconn.util.Api;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * Servlet implementation class CoupleUp
 */
@WebServlet("/couple_up")
public class CoupleUp extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CoupleUp() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    
    public void TestFunc() {
    }
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String coupleUpRequestsString = new Api("create-couple", true, request).get(new String[0], new HashMap<String, String>()).get("text");
		ObjectMapper objectMapper = new ObjectMapper();
		CoupleRequestsJson coupleUpRequests = objectMapper.readValue(coupleUpRequestsString, new TypeReference<CoupleRequestsJson>(){});	

		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("coupleUpRequests", coupleUpRequests);
		
		request.setAttribute("data", data);
		
		if (request.getParameter("new_request") != null) {
			request.setAttribute("template", "/WEB-INF/templates/couple_up/new_request.twig.html");
		} else if (request.getParameter("request_to") != null) {
			request.setAttribute("template", "/WEB-INF/templates/couple_up/request_to.twig.html");
		} else {
			request.setAttribute("template", "/WEB-INF/templates/couple_up/couple_up.twig.html");
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	

}
