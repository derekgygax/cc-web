package com.coupleconn.webpages;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.jtwig.web.servlet.JtwigDispatcher;
import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.data.Couple;
import com.coupleconn.data.Partner;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class Email
 */
@WebServlet("/login-select")
public class LoginSelect extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();   
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginSelect() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		//Get partner data
		HttpSession session = request.getSession(false);
		HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
		Partner partner = new Partner().get(userLoggedIn.get("partnerId"), request);
		
		//Get our couple data
		Couple couple = new Couple().get(userLoggedIn.get("coupleId"), request);
		
		data.put("partner", partner);
		data.put("couple", couple);
		request.setAttribute("data", data);		
		request.setAttribute("template", "/WEB-INF/templates/login/login-select.html");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		Api api = new Api("switch-user", true, request);
		// No data needs to go
		HashMap<String, String> loginResponse = api.post(new String[0], "");
		int responseStatus = Integer.parseInt(loginResponse.get("status"));
		if (responseStatus == 200){
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, String> responseText = objectMapper.readValue(
					loginResponse.get("text"), new TypeReference<HashMap<String, String>>(){}
			);

			// If there is a session invalidate it
			HttpSession session = request.getSession(false);
			if (session != null){
				session.invalidate();
			}
			
			// Start a new session
			Utils.startSession(
				null, 
				responseText.get("partnerId"), 
				null, 
				responseText.get("token"),
				request
			);
			
		} else if (responseStatus == 401){
			// If a 401 occurs report it
			ServletOutputStream o = response.getOutputStream();
			JsonFactory f = new JsonFactory();
			JsonGenerator g = f.createGenerator(o);
			g.writeStartObject();
			g.writeStringField("status","401");
			g.writeEndObject();
			g.close();
			o.close();
			
		} else {
			//Do something
			//DO SOMETHING!
		}
	}

}
