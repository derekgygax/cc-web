package com.coupleconn.webpages;

import com.google.common.collect.ImmutableMap;
import org.jtwig.web.servlet.JtwigRenderer;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/help")
public class Help extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Help() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String referer = request.getParameter("referer");
		
		HttpSession session = request.getSession(false);
		if(session != null) {
			HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
			HashMap<String, Object> data = new HashMap<String, Object>();
			request.setAttribute("template", "/WEB-INF/templates/index/help.twig.html");
			request.setAttribute("data", data);
		} else {
			renderer.dispatcherFor("/WEB-INF/templates/index/help.twig.html")
	        .with("name", "Jtwig")
	        .with("referer", referer)
	        .render(request, response);
		}
		

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}
