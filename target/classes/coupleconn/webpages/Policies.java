package com.coupleconn.webpages;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jtwig.web.servlet.JtwigRenderer;

/**
 * Servlet implementation class Privacy
 */
@WebServlet("/policies")
public class Policies extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Policies() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String referer = request.getParameter("referer");
		
		HttpSession session = request.getSession(false);
		if(session != null) {
			HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
			HashMap<String, Object> data = new HashMap<String, Object>();
			request.setAttribute("template", "/WEB-INF/templates/index/policies.html");
			request.setAttribute("data", data);
		} else {
			renderer.dispatcherFor("/WEB-INF/templates/index/policies.html")
	        .with("referer", referer)
	        .render(request, response);
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
