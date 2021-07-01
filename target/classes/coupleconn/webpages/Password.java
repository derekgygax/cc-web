package com.coupleconn.webpages;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.jtwig.web.servlet.JtwigDispatcher;
import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.util.Api;

/**
 * Servlet implementation class Email
 */
@WebServlet("/password-reset")
public class Password extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();   
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Password() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HashMap<String, Object> data = new HashMap<String, Object>();

		if (request.getParameterMap().containsKey("reset-password")){
			
			data.put("passwordToken", request.getParameter("reset-password"));
//			System.out.println(data.get("passwordToken"));
			
			
						
			JtwigDispatcher dispatcher = renderer
					.dispatcherFor("/WEB-INF/templates/login/password_reset.html")
					.with("passwordToken", request.getParameter("reset-password"));
			
			dispatcher.render(request, response);
		} else if (request.getParameterMap().containsKey("request")){
			String email = request.getParameter("request");

			HashMap<String, String> passwordParameters = new HashMap<String, String>();
			passwordParameters.put("email", email);
//			System.out.println(email);
			String resendStr = new Api("send-resetpw-email", false, request).get(new String[0], passwordParameters).get("text");
			
//			System.out.println(resendStr);
			//request.setAttribute("template", "/WEB-INF/templates/images/new_image.html");
		} else {
		
			//request.setAttribute("template", "/WEB-INF/templates/images/images_base.twig.html");
		}
		request.setAttribute("data", data);		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//		System.out.println(request.getParameter("token"));
//		System.out.println(request.getParameter("password"));
		
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("token", request.getParameter("token"));
		jsonObj.put("password", request.getParameter("password"));
		
		String json = jsonObj.toJSONString();
//		System.out.println(json);
		
		HashMap<String, String> apiResponse = new Api("reset-password", false, request).postWith(new String[0], jsonObj);

		JtwigDispatcher dispatcher = renderer.dispatcherFor("/WEB-INF/templates/login/login_single.html");
		dispatcher.render(request, response);

	}

}
