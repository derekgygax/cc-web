package com.coupleconn.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class Router
 */
@WebServlet("/router")
public class Router extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Router() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> requestParams = Utils.getRequestParams(request);
        
		if (!requestParams.get("method").equals("GET")){
			//TODO
			//Is this even teh correct way to do this??
			if (!requestParams.get("servlet").equals("change-password")){
				String apiResponse = new Api(requestParams.get("servlet"), true, request).post(requestParams.get("path_extensions"), requestParams.get("data")).get("text");
				response.getWriter().write(apiResponse);
			}
		}
	}

}
