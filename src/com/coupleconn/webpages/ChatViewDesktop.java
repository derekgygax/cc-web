package com.coupleconn.webpages;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.data.ChatRoomInfo;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class Chat
 */
@WebServlet("/chat_view/desktop")
public class ChatViewDesktop extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ChatViewDesktop() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		BufferedReader requestReader = request.getReader();
    	StringBuilder infoStringBuffer = new StringBuilder();
    	String line;
        while ((line = requestReader.readLine()) != null) {
        	infoStringBuffer.append(line);
        }
        ObjectMapper om = new ObjectMapper();
		ChatRoomInfo chatRoomInfo = om.readValue(infoStringBuffer.toString(), ChatRoomInfo.class);
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("roomId", chatRoomInfo.roomId);
		data.put("homePartnerId", chatRoomInfo.homePartnerId);
		data.put("matchHigherName", chatRoomInfo.matchHigherName);
		data.put("matchLowerName", chatRoomInfo.matchLowerName);
		
		// Set the attributes that will be read in the filter where the rendering will occur
		request.setAttribute("template", "/WEB-INF/templates/chat/desktop_chat_card.twig.html");
		request.setAttribute("data", data);		
	}

}
