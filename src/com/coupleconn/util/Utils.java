package com.coupleconn.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class Utils {
	
	public static String getRequestContent(BufferedReader requestReader) throws IOException {
    	StringBuilder infoStringBuffer = new StringBuilder();
    	String line;
        while ((line = requestReader.readLine()) != null) {
        	infoStringBuffer.append(line);
        }		
        return infoStringBuffer.toString();
	}
	
	public static String escapeHTML(String s) {
		if (s == null){
			return null;
		}
	    StringBuilder out = new StringBuilder(Math.max(16, s.length()));
	    for (int i = 0; i < s.length(); i++) {
	        char c = s.charAt(i);
	        if (c > 127 || c == '"' || c == '<' || c == '>' || c == '&') {
	            out.append("&#");
	            out.append((int) c);
	            out.append(';');
	        } else {
	            out.append(c);
	        }
	    }
	    return out.toString();
	}
	
	public static void startSession(String password, String partnerId, String coupleId, String token, HttpServletRequest request){
		HashMap<String, String> userLoggedIn = new HashMap<String, String>();
		userLoggedIn.put("password", password);
		userLoggedIn.put("partnerId", partnerId);
		userLoggedIn.put("coupleId", coupleId);
		userLoggedIn.put("token", token);
		
		HttpSession session = request.getSession();
		session.setAttribute("userLoggedIn", userLoggedIn);
	}
	
	public static HashMap<String, String> getLoggedInInfo(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HashMap<String, String> userLoggedIn = null;
        HttpSession session = request.getSession(false);
        //TODO
        //DOes this if here even work??? Should you put it somewhere else??
        if (sessionSetup(session, request, response)) {
        	userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
        }
		return userLoggedIn;
	}
	
	public static boolean userInCouple(HttpSession session){
		boolean inCouple = false;
		HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
		if (userLoggedIn.get("coupleId") != null){
			inCouple = true;
		}
		return inCouple;
	}
	
	public static boolean userInCouple(HttpServletRequest request){
		HttpSession session = request.getSession(false);
		return userInCouple(session);
	}
	
	public static boolean sessionSetup(HttpSession session, HttpServletRequest request, HttpServletResponse response) throws IOException {
        //TODO
        //DOes this if here even work??? Should you put it somewhere else??
        if (session == null || session.getAttribute("userLoggedIn") == null) {
        	response.sendRedirect(request.getContextPath());
        	return false;
        } else {
        	return true;
        }
	}
	
	public static HashMap<String, String> getRequestParams(HttpServletRequest request) throws IOException {
		
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("servlet", "");
		params.put("method", "");
		params.put("path_extensions", "");
		params.put("data", "");
		
        if (request.getHeader("Content-Type").equals("text/plain;charset=UTF-8")){
            StringBuilder postDataStr = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while((line = reader.readLine()) != null){
            	postDataStr.append(line);
            }
            //TODO
            //Am I doing enough for closing and everything!!!
            reader.close();
            for (String paramData: postDataStr.toString().split("&")){
            	String[] paramThenData = paramData.split("=");
            	switch (paramThenData[0]){
	            	case "servlet":
	            		params.put("servlet", paramThenData[1]);
	            		break;
	            	case "method":
	            		params.put("method", paramThenData[1]);
	            		break;
	            	case "path_extensions":
	            		params.put("path_extensions", paramThenData[1]);
	            		break;
	            	case "data":
	            		params.put("data", paramThenData[1]);
	            		break;
            	}
            }
        } else {
        	params.put("servlet", request.getParameter("servlet"));
        	params.put("method", request.getParameter("method"));
        	params.put("path_extensions", request.getParameter("path_extensions"));
    		params.put("data", request.getParameter("data"));
        	
        }
        return params;
	}
	
	public static void changeCoupleIdInSession(String coupleId, HttpServletRequest request, HttpServletResponse response) throws IOException {
//		Change the userLoggedIn attribute in the session to include the new partnerID
		HashMap<String, String> userLoggedIn = getLoggedInInfo(request, response);
		userLoggedIn.put("coupleId", coupleId);
//		NOTE that a new session is NOT started here
		HttpSession session = request.getSession(false);
		session.setAttribute("userLoggedIn", userLoggedIn);
	}
	
	public static boolean valueNotSet(String value){
		if (value == null || value.trim().isEmpty()){
			return true;
		} else {
			return false;
		}
	}
}
