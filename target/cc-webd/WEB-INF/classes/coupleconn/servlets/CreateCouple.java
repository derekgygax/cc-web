package com.coupleconn.servlets;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class CreateCouple
 */
@WebServlet("/create_couple")
public class CreateCouple extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateCouple() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> requestParams = Utils.getRequestParams(request);
		ObjectMapper om = new ObjectMapper();
		HashMap<String, String> coupleUpRequestInfo = om.readValue(requestParams.get("data"), HashMap.class);
		
		HashMap<String, String> apiResponse = new Api("create-couple", true, request).post(
				requestParams.get("path_extensions"), 
				requestParams.get("data")
		);
		if (apiResponse.get("status").equals("200")){
			// The couple up has succeeded and you need to reset the coupleId in the session
			if (coupleUpRequestInfo.get("action").equals("accept")){
				Utils.changeCoupleIdInSession(
						apiResponse.get("text"),
						request,
						response
						);
			}
			ObjectMapper responseOm = new ObjectMapper();
			response.getWriter().write(responseOm.writeValueAsString(coupleUpRequestInfo));	
			response.setStatus(200);
		} else {
			response.setStatus(401);
			response.getWriter().write("The couple up did not work");
		}
	}

}
