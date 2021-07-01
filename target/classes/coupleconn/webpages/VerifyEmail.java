package com.coupleconn.webpages;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.RequestDispatcher;
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

/**
 * Servlet implementation class VerifyEmail
 */
@WebServlet("/verifyemail")
public class VerifyEmail extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VerifyEmail() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// combining the 2 email servlets...
		if (request.getParameterMap().containsKey("resendEmail")){
			String partnerId = request.getParameter("resendEmail");
			HashMap<String, String> emailParameters = new HashMap<String, String>();
			String resendStr = new Api("send-verify-email", true, request).get(new String[0], emailParameters).get("text");
			//request.setAttribute("template", "/WEB-INF/templates/images/couple_images.html");
			return;
		} else if(request.getParameterMap().containsKey("sendCoupleRequest")) {
			String sendTo = request.getParameter("sendCoupleRequest");
			HashMap<String, String> userLoggedIn = Utils.getLoggedInInfo(request, response);
			String partnerId = userLoggedIn.get("partnerId");
			
			HashMap<String, String> emailParameters = new HashMap<String, String>();
			emailParameters.put("partnerId", partnerId);
			emailParameters.put("sendTo", sendTo);
			
			System.out.println(partnerId);
			System.out.println(sendTo);
			String coupleRequestStr = new Api("send-couple-request-email", true, request).get(new String[0], emailParameters).get("text");
			
			
			return;
		}
		
		boolean userIsLoggedIn = false;
		boolean gotVerified = false;
		
		String token = request.getParameter("token");
		
		HashMap<String, String> emailParameters = new HashMap<String, String>();
		emailParameters.put("token", token);
		
		HashMap<String, String> apiResponse = new Api("verify-email", false, request).postWith(new String[0], emailParameters);
		
		if (apiResponse.get("status").equals("200")){
			// Get the partner info from the response
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, String> partnerInfo = objectMapper.readValue(apiResponse.get("text"), new TypeReference<HashMap<String, String>>(){});

			// If there is a session invalidate it
			HttpSession session = request.getSession(false);
			if (session != null){
				session.invalidate();
			}
			
			// Start a new session
			Utils.startSession(
				null, 
				partnerInfo.get("partnerId"), 
				null, 
				partnerInfo.get("token"),
				request
			);			

		}
		
		response.sendRedirect("/requirements");
		return;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}
