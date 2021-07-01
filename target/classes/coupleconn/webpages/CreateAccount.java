package com.coupleconn.webpages;

import com.coupleconn.data.Partner;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;

import org.json.simple.parser.JSONParser;
import org.jtwig.web.servlet.JtwigRenderer;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/create-account")
public class CreateAccount extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateAccount() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String token = null;
		String toBeRegisteredEmail = null;
		
		if(request.getParameterMap().containsKey("coupleRequest")) {
			String sendTo = request.getParameter("coupleRequest");
			token = request.getParameter("coupleRequest");
			
			HashMap<String, String> parameters = new HashMap<String, String>();
			
			parameters.put("coupleRequestToken", token);
			parameters.put("secretPhrase", "a-secret-phrase");
			
			String tokenStr = new Api("create-couple-with-token", false, request).get(new String[0], parameters).get("text");
			Map<String, String> tokenData = new ObjectMapper().readValue(tokenStr, HashMap.class);
			if (tokenData.get("partnerId") == null){
				response.sendRedirect("/");
				return;
			}
		
			toBeRegisteredEmail = tokenData.get("email_address");
			String awayPartnerInCouple = tokenData.get("awayPartnerInCouple");
			
			if(awayPartnerInCouple.equals("true")) {
				response.sendRedirect("/");
				return;
			}
		}
		
		renderer.dispatcherFor("/WEB-INF/templates/create_account/create_account_from_request.html")
        .with("name", "Jtwig")
        .with("token", token)
        .with("toBeRegisteredEmail", toBeRegisteredEmail)
        .render(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String newAccounts = Utils.getRequestContent(request.getReader());
		HashMap<String, String> createAccountResponse = new Api("create-account", false, request).post(new String[0], newAccounts);

		
		if (createAccountResponse.get("status").equals("200")){
			ObjectMapper omResponse = new ObjectMapper();
			HashMap<String, String> coupleIdToken = omResponse.readValue(createAccountResponse.get("text"), new TypeReference<HashMap<String, String>>(){});
			Utils.startSession(
					null, 
					coupleIdToken.get("partnerHigherId"),
					coupleIdToken.get("coupleId"),
					coupleIdToken.get("token"),
					request
					);
			response.getWriter().write("{}");
		} else {
			// This can change later but must be 200 right now because the API is throwing an error
			response.setStatus(200);

			String responseTxt = createAccountResponse.get("text");
			HashMap<String, HashMap<String, HashMap<String, String>>> error = new HashMap<String, HashMap<String, HashMap<String, String>>>();
			// Starting the error mapping
			error.put("error", new HashMap<String, HashMap<String, String>>());
			// Adding duplicates
			if (responseTxt.contains("Duplicate entry")){
				HashMap<String, String> duplicate = new HashMap<String, String>();
				if (responseTxt.contains("email")){
					duplicate.put("email", "Sorry, that email is already being used.");
				}
				error.get("error").put("duplicate", duplicate);
			}
			ObjectMapper om = new ObjectMapper();
			response.getWriter().write(om.writeValueAsString(error));

		}
		
		
		
		
		
		
		
		
//		String newUserData = request.getParameter("data");
//		
//		String coupleUpToken = request.getParameter("coupleRequest");
//		HashMap<String, String> statusAndNewPartnerId = null;
//		
//		if(coupleUpToken != null && !coupleUpToken.equals("")){
//			statusAndNewPartnerId = new Partner().createWithToken(newUserData, coupleUpToken, request);
//		} else {
//			statusAndNewPartnerId = new Partner().create(newUserData, request);
//		}
//
//		if (statusAndNewPartnerId.get("status").equals("200")){
//			ObjectMapper om = new ObjectMapper();
//			ObjectMapper omResponse = new ObjectMapper();
//			HashMap<String, String> partnerIdToken = omResponse.readValue(statusAndNewPartnerId.get("text"), new TypeReference<HashMap<String, String>>(){});
//			
//			HashMap<String, String> userPassword = om.readValue(newUserData, new TypeReference<HashMap<String, String>>(){});
//			System.out.println(userPassword);
//			Utils.startSession(
//					userPassword.get("password"), 
//					partnerIdToken.get("partnerId"), 
//					null,
//					partnerIdToken.get("token"),
//					request
//					);
//			response.getWriter().write("{}");
//		} else {
//			// This can change later but must be 200 right now because the API is throwing an error
//			response.setStatus(200);
//			
//			String responseTxt = statusAndNewPartnerId.get("text");
//			HashMap<String, HashMap<String, HashMap<String, String>>> error = new HashMap<String, HashMap<String, HashMap<String, String>>>();
//			// Starting the error mapping
//			error.put("error", new HashMap<String, HashMap<String, String>>());
//			// Adding duplicates
//			if (responseTxt.contains("Duplicate entry")){
//				HashMap<String, String> duplicate = new HashMap<String, String>();
//				if (responseTxt.contains("email")){
//					duplicate.put("email", "Sorry, that email is already being used.");
//				}
//				error.get("error").put("duplicate", duplicate);
//			}
//			ObjectMapper om = new ObjectMapper();
//			response.getWriter().write(om.writeValueAsString(error));
//			
//		}
	}

}
