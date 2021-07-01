package com.coupleconn.webpages;

import com.coupleconn.data.Partner;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import org.jtwig.web.servlet.JtwigRenderer;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/create_account")
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

		renderer.dispatcherFor("/WEB-INF/templates/create_account/create_account.twig.html")
        .with("name", "Jtwig")
        .render(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String newUserData = request.getParameter("data");
		
		HashMap<String, String> statusAndNewPartnerId = new Partner().create(newUserData, request);
		if (statusAndNewPartnerId.get("status").equals("200")){
			ObjectMapper om = new ObjectMapper();
			HashMap<String, String> userPassword = om.readValue(newUserData, new TypeReference<HashMap<String, String>>(){});
			Utils.startSession(
					userPassword.get("username"), 
					userPassword.get("password"), 
					statusAndNewPartnerId.get("text"), 
					null, 
					request
					);
			response.getWriter().write("{}");
		} else {
			// This can change later but must be 200 right now because the API is throwing an error
			response.setStatus(200);
			
			String responseTxt = statusAndNewPartnerId.get("text");
			HashMap<String, HashMap<String, HashMap<String, String>>> error = new HashMap<String, HashMap<String, HashMap<String, String>>>();
			// Starting the error mapping
			error.put("error", new HashMap<String, HashMap<String, String>>());
			// Adding duplicates
			if (responseTxt.contains("Duplicate entry")){
				HashMap<String, String> duplicate = new HashMap<String, String>();
				if (responseTxt.contains("username")){
					duplicate.put("username", "Sorry, that username is already being used.");
				}
				if (responseTxt.contains("email")){
					duplicate.put("email", "Sorry, that email is already being used.");
				}
				error.get("error").put("duplicate", duplicate);
			}
			ObjectMapper om = new ObjectMapper();
			response.getWriter().write(om.writeValueAsString(error));
			
		}
	}

}
