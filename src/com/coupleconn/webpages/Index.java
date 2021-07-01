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

/**
 * Servlet implementation class CreateAccount
 */
@WebServlet("/")
public class Index extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Index() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String referer = request.getParameter("referer");
		HashMap<String, String> links = new HashMap<String, String>();
		links.put("how_to_one", System.getenv("LINK_HOW_TO_ONE"));
		links.put("how_to_two", System.getenv("LINK_HOW_TO_TWO"));
		links.put("how_to_three", System.getenv("LINK_HOW_TO_THREE"));
		links.put("kofi", System.getenv("LINK_KOFI"));
		
		renderer.dispatcherFor("/WEB-INF/templates/index/index.twig.html")
		.with("links", links)
        .with("name", "Jtwig")
        .with("referer", referer)
        .render(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}
