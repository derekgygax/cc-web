package com.coupleconn.filters;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.catalina.servlet4preview.RequestDispatcher;
import org.jtwig.web.servlet.JtwigDispatcher;
import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.data.Couple;
import com.coupleconn.data.Partner;
import com.coupleconn.data.PartnerJson;
import com.coupleconn.data.SearchParam;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet Filter implementation class LoginFilter
 */
@WebFilter("/loginFilter")
public class LoginFilter implements Filter {
	private final JtwigRenderer renderer = JtwigRenderer.defaultRenderer();
	private final boolean dontPassGo = true;
    /**
     * Default constructor. 
     */
    public LoginFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        // If a js, css, or img file then ignore
        String[] prefixesToIgnore = new String[]{"/css/", "/js/", "/img/"};
        for (String prefix: prefixesToIgnore){
        	if (request.getRequestURI().startsWith(request.getContextPath() + prefix)){
        		chain.doFilter(req, res);
        		return;
        	}
        }
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userLoggedIn") == null) {
        	// If there was a session open but it didn't have the user info in it then close that session
        	if (session != null){
        		session.invalidate();
        	}
        	if (isLoginOrCreateAccountPage(request)){
        		chain.doFilter(req, res);
        		return;
        	} else {
        		// No logged-in user found, so redirect to login page.
        		if (request.getRequestURI().equals(request.getContextPath() + "/help")){
        			chain.doFilter(req, res);
        		} else if (request.getRequestURI().equals(request.getContextPath() + "/policies")){
        			chain.doFilter(req, res);
        		} else {
            		response.sendRedirect("/");
            		return;
        		}

        	}
        } else {
        	if (isLoginOrCreateAccountPage(request)){

        		if (request.getRequestURI().equals(request.getContextPath() + "/verifyemail")){
        			chain.doFilter(req, res);
        		} else if (request.getRequestURI().equals(request.getContextPath() + "/contact")) {
        			chain.doFilter(req, res);
        		} else if (request.getRequestURI().equals(request.getContextPath() + "/policies")) {
        			chain.doFilter(req, res);
        		} else if (request.getRequestURI().equals(request.getContextPath() + "/terms")) {
        			chain.doFilter(req, res);
        		} else if (request.getRequestURI().equals(request.getContextPath() + "/password-reset")) {
        			chain.doFilter(req, res);
        		} else {
        			response.sendRedirect("/profile");
        		}
        		return;
        	} else {


        		HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
//        		System.out.println(userLoggedIn);
        		// If the token isn't correct. So it isn't the most up to date one
        		// then log them out!!!
        		if (!correctLoginToken(userLoggedIn)){
        			session.invalidate();
        			response.sendRedirect("/");
        			return;
        		}
        		        		
        		// Logged-in user found, so just continue request.
        		chain.doFilter(req, res);
        		
				if (request.getAttribute("template") != null){
					JtwigDispatcher dispatcher = null;
					
					String webPageOn = request.getRequestURI();

					//Get the home couple data
					HashMap<String, Object> webPageData = (HashMap<String, Object>) request.getAttribute("data");
					Couple homeCouple = null;
					PartnerJson homePartner = null;
					PartnerJson awayPartner = null;
					boolean coupleIsActive = false;
					if(userLoggedIn.get("coupleId") != null){
						HashMap<String, Object> userDetail = getDetailedUserInfo(userLoggedIn, request);
						homeCouple = (Couple) userDetail.get("homeCouple");
						// Check if the couple is active. So they have finished the requirements
						coupleIsActive = homeCouple.isActive(request);
						homePartner = (PartnerJson) userDetail.get("homePartner");
						awayPartner = (PartnerJson) userDetail.get("awayPartner");
						// If the data doesn't already have matches then retrieve it
						if (!webPageData.containsKey("matches")){
							// Get all the matches
							// This lets you detect if you have been sent a message
							String matches = null;
							HashMap<String, String> matchesParameters = new HashMap<String, String>();
							matchesParameters.put("ismatch", "true");
							matches = new Api("matches", true, request).get(new String[0], matchesParameters).get("text");
							webPageData.put("matches", matches);
						}
					} else {
						// Here we are double checking on every request to see if a couple
						// has been established for a user. It is like polling
						// No one likes this but we haven't set it up to work any
						// other way yet.
						String coupleId = checkCoupleId(userLoggedIn);
						if (coupleId != null){
							// This changes the session!!!
							userLoggedIn.put("coupleId", coupleId);
							session.setAttribute("userLoggedIn", userLoggedIn);
							StringBuilder redirectUrl = new StringBuilder(request.getRequestURI().toString());
						    String queryString = request.getQueryString();
						    if (queryString != null) {
						        redirectUrl.append('?').append(queryString);
						    } 
							response.sendRedirect(redirectUrl.toString());
							// When you redirect return
							// that way the rest doesn't try to happen
							return;
						} else {
							homePartner = new PartnerJson(new Partner().get(userLoggedIn.get("partnerId"), request));
						}
					}
					//TODO
					// When you create an account WHY is the /profile page being hit twice?
					// Determine is user is ready to view other couples
					if (coupleIsActive){
						if(homePartner.verifiedEmail == 0 && homePartner.emailAddress != null) {
							homePartner.readyToMingle = false;
						} else {
							homePartner.readyToMingle = true;
						}
						awayPartner.readyToMingle = true;
					} else {
						homePartner.setReadyToMingle(homeCouple, request);
						if (homePartner.readyToMingle){
							// readyToMingle would never be true unless the person is already in a couple
							// So not checking if the couple isn't null. Assuming its not
							homeCouple.changeActive(request, "true");
						}
					}
					if (homePartner.readyToMingle == false 
						&& !request.getRequestURI().equals(request.getContextPath() + "/requirements")
						&& !request.getRequestURI().equals(request.getContextPath() + "/email")
						&& !request.getRequestURI().equals(request.getContextPath() + "/password-reset")
						){
						if (dontPassGo == true){
							response.sendRedirect(request.getContextPath() + "/requirements");
							return;
						}
					}
					if (homePartner.readyToMingle == true 
						&& request.getRequestURI().equals(request.getContextPath() + "/requirements")
						&& !request.getParameterMap().containsKey("onlycontent")) 
					{
						response.sendRedirect(request.getContextPath() + "/profile");
						return;
					}

					

					if (request.getParameter("d") != null && request.getParameter("d").equals("json")){
						// Identify template for json dispatcher
						dispatcher = renderer.dispatcherFor("/WEB-INF/templates/jsonDisplay/display.twig.html");

						HashMap<String, Object> jsonDisplay = new HashMap<String, Object>();
						for (String key: webPageData.keySet()){
							jsonDisplay.put(key, webPageData.get(key));
						}
						jsonDisplay.put("webPageOn", webPageOn);
						jsonDisplay.put("homeCouple", homeCouple);
						jsonDisplay.put("homePartner", homePartner);
						jsonDisplay.put("awayPartner", awayPartner);
						jsonDisplay.put("userInCouple", Utils.userInCouple(session));

						ObjectMapper omJsonDisplay = new ObjectMapper();
						dispatcher.with("json", omJsonDisplay.writeValueAsString(jsonDisplay));
					} else {
						// Set the dispatcher to the template
						String template = (String) request.getAttribute("template");
						dispatcher = renderer.dispatcherFor(template);

						ObjectMapper objectMapper = new ObjectMapper();
						String searchParamsStr = new Api("search/parameters", true, request)
								.get(new String[0], new HashMap<String, String>())
								.get("text");
						
						ArrayList<SearchParam> searchParams = objectMapper
								.readValue(searchParamsStr, new TypeReference<ArrayList<SearchParam>>(){});
						
						// Put the data for the request in the dipatcher
						for (String key: webPageData.keySet()){
							dispatcher.with(key, webPageData.get(key));
						}
						dispatcher.with("webPageOn", webPageOn);
						dispatcher.with("homeCouple", homeCouple);
						dispatcher.with("homePartner", homePartner);
						dispatcher.with("awayPartner", awayPartner);
						dispatcher.with("searchParams", searchParams);
						dispatcher.with("userInCouple", Utils.userInCouple(session));
					}

					dispatcher.render(request, response);			
				} else {
				}
				
        		
        		return;
        	}
        }
	}
	
	private boolean isLoginOrCreateAccountPage(HttpServletRequest request){
		String[] loginPath = new String[]{"/", "/login", "/create-account", "/test", "/contact", "/verifyemail", "/password-reset"};
		for (String path: loginPath){
			if (request.getRequestURI().equals(request.getContextPath() + path)){
				return true;
			}
		}
		return false;
	}
	
	private String checkCoupleId(HashMap<String, String> userLoggedIn) throws IOException {
		HashMap<String, String> token = new HashMap<String, String>();
		token.put("token", userLoggedIn.get("token"));
		Api api = new Api("login", false, userLoggedIn);
		HashMap<String, String> loginResponse = api.postWith(new String[0], token);
		ObjectMapper objectMapper = new ObjectMapper();
		HashMap<String, String> responseText = objectMapper.readValue(
				loginResponse.get("text"), new TypeReference<HashMap<String, String>>(){}
		);
		return responseText.get("coupleId");
	}
	
	private boolean correctLoginToken(HashMap<String, String> userLoggedIn) throws IOException {
		HashMap<String, String> token = new HashMap<String, String>();
		token.put("token", userLoggedIn.get("token"));
		Api api = new Api("login", false, userLoggedIn);
		HashMap<String, String> loginResponse = api.postWith(new String[0], token);
//		System.out.println(loginResponse);
		if (loginResponse.get("status").equals("401")){
			return false;
		} else {
			return true;
		}
	}
	
	private HashMap<String, Object> getDetailedUserInfo(HashMap<String, String> userLoggedIn, HttpServletRequest request){
		Couple homeCouple = new Couple().get(userLoggedIn.get("coupleId"), request);	
		PartnerJson homePartner = null;
		PartnerJson awayPartner = null;
		if (userLoggedIn.get("partnerId").equals(homeCouple.partnerIdHigher)){
			homePartner = homeCouple.partners.get(homeCouple.partnerIdHigher);
			awayPartner = homeCouple.partners.get(homeCouple.partnerIdLower);
		} else {
			homePartner = homeCouple.partners.get(homeCouple.partnerIdLower);
			awayPartner = homeCouple.partners.get(homeCouple.partnerIdHigher);
		}
		HashMap<String, Object> detailedInfo = new HashMap<String, Object>();
		detailedInfo.put("homeCouple", homeCouple);
		detailedInfo.put("homePartner", homePartner);
		detailedInfo.put("awayPartner", awayPartner);
		return detailedInfo;
	}
	

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
