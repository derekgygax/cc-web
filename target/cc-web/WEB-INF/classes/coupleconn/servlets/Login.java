package com.coupleconn.servlets;

import java.awt.List;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;

/**
 * Servlet implementation class Login
 */
@WebServlet("/login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Login() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		response.sendRedirect(request.getContextPath());
	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ObjectMapper om = new ObjectMapper();
			
/*
		Map<String, Object> map = new HashMap<String, Object>();
		map = om.readValue(request.getParameter("data"), new TypeReference<Map<String, String>>(){});

		String referer = (String) map.get("referer");
		*/
		
		HashMap<String, String> userPassword = om.readValue(
				request.getParameter("data"), new TypeReference<HashMap<String, String>>(){}
		);	

		Api api = new Api("login", true, userPassword);
		HashMap<String, String> loginResponse = api.get(new String[0], new HashMap<String, String>());
		
		int responseStatus = Integer.parseInt(loginResponse.get("status"));
		if (responseStatus == 200){
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, String> responseText = objectMapper.readValue(
					loginResponse.get("text"), new TypeReference<HashMap<String, String>>(){}
			);

			Utils.startSession(
				userPassword.get("username"), 
				userPassword.get("password"), 
				responseText.get("partnerId"), 
				responseText.get("coupleId"), 
				request
			);
			

		} else if (responseStatus == 401){
			response.setStatus(401);
			response.getWriter().write("The username or password is incorrect.");
		} else {
			//Do something
			//DO SOMETHING!
		}
	}

}
