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
import com.coupleconn.data.PartnerJson;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class Email
 */
@WebServlet("/extra-login")
public class ExtraLogin extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();   
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ExtraLogin() {
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

		PartnerJson partnerHigher = couple.partners.get(couple.partnerIdHigher);
		PartnerJson partnerLower = couple.partners.get(couple.partnerIdLower);
		if(partnerHigher.emailAddress != null && partnerLower.emailAddress != null) {
			response.sendRedirect("/profile");
		} else {
			data.put("partner", partner);
			data.put("couple", couple);
			request.setAttribute("data", data);		
			request.setAttribute("template", "/WEB-INF/templates/login/add-extra-login.html");
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Hit post");
		System.out.println(request.getParameter("partnerId"));

		HashMap<String, String> extraLogin = new HashMap<String, String>();
		
		String partnerId = (String) request.getParameter("partnerId");
		String email = (String) request.getParameter("emailAddress");
		String firstName = (String) request.getParameter("firstName");
		String lastName = (String) request.getParameter("lastName");
		String password = (String) request.getParameter("password");
		
		extraLogin.put("partnerId", partnerId);
		extraLogin.put("emailAddress", email);
		extraLogin.put("firstName", firstName);
		extraLogin.put("lastName", lastName);
		extraLogin.put("password", password);
		
		HashMap<String, String> createAccountResponse = new Api("create-extra-login", true, request).postWith(new String[0], extraLogin);
		
		System.out.println(createAccountResponse.get("status"));
		if(createAccountResponse.get("status").equals("200")) {
			ObjectMapper objectMapper = new ObjectMapper();
			HashMap<String, String> responseText = objectMapper.readValue(
					createAccountResponse.get("text"), new TypeReference<HashMap<String, String>>(){}
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
			
			ServletOutputStream o = response.getOutputStream();
			JsonFactory f = new JsonFactory();
			JsonGenerator g = f.createGenerator(o);
			g.writeStartObject();
			g.writeStringField("status", "success");
			g.writeEndObject();
			g.close();
			o.close();
		} else {
			ServletOutputStream o = response.getOutputStream();
			JsonFactory f = new JsonFactory();
			JsonGenerator g = f.createGenerator(o);
			g.writeStartObject();
			g.writeStringField("status", "error");
			g.writeEndObject();
			g.close();
			o.close();
		}
	}

}
