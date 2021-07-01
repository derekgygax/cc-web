package com.coupleconn.webpages;

import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import org.jtwig.web.servlet.JtwigRenderer;

import com.coupleconn.data.Couple;
import com.coupleconn.data.Image;
import com.coupleconn.data.Partner;
import com.coupleconn.data.PartnerJson;
import com.coupleconn.data.UnitedStates;
import com.coupleconn.util.Api;
import com.coupleconn.util.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Servlet implementation class UploadPhotos
 */
@WebServlet("/images")
@MultipartConfig()
public class Images extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Images() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int numberAllowedImages = 5;
		ArrayList<String> inputImgNames = new ArrayList<String>();
		for (int i=1; i < numberAllowedImages; i++){
			inputImgNames.add(Integer.toString(i));
		}
		
		//Get partner data
		HttpSession session = request.getSession(false);
		HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
		Partner partner = new Partner().get(userLoggedIn.get("partnerId"), request);
		
		Couple couple = null;
		PartnerJson partnerHigher = null;
		PartnerJson partnerLower = null;
		HashMap coupleResponse = new HashMap();
		
		//Get couple data
		if(userLoggedIn.get("coupleId") != null) {
			couple = new Couple().get(userLoggedIn.get("coupleId"), request);	
			partnerHigher = couple.partners.get(couple.partnerIdHigher);
			partnerLower = couple.partners.get(couple.partnerIdLower);
			coupleResponse = couple.getHashMap();
		}
		
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("couple", coupleResponse);
		data.put("inputImgNames", inputImgNames);
		
		// Set the attributes that will be read in the filter where the rendering will occur
		if (request.getParameterMap().containsKey("onlycontent")){
			data.put("onlycontent", true);
			request.setAttribute("template", "/WEB-INF/templates/images/couple_images.html");
		} else if (request.getParameterMap().containsKey("onlyimage")){
			data.put("onlyimage", true);
			data.put("inputName", request.getParameter("onlyimage"));
			request.setAttribute("template", "/WEB-INF/templates/images/new_image.html");
		} else {
		
			request.setAttribute("template", "/WEB-INF/templates/images/images_base.twig.html");
		}
		
		request.setAttribute("data", data);		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Collection<Part> parts = request.getParts();
		HashMap<String, String> dimensions = new HashMap<String, String>();
		HashMap<String, Image> images = new HashMap<String, Image>();
		for (Part part: parts){
			if (part.getName().startsWith("cropDimensions_")){
				dimensions.put(
					part.getName().replaceAll("cropDimensions_", ""),
					extractString(part.getInputStream())
				);
			} else if (part.getName().startsWith("image_")){
				Image img = new Image(
					part.getSubmittedFileName(),
					part.getContentType(),
					ImageIO.read(part.getInputStream())
				);
				images.put(
					part.getName().replaceAll("image_", ""), 
					img
				);
			} else if (part.getName().startsWith("url_")){
				Image img = new Image(
					extractString(part.getInputStream())
				);
				images.put(
					part.getName().replaceAll("url_", ""),
					img
				);
				
			} else if(part.getName().startsWith("blank_")){
				Image img = new Image();
				images.put(
					part.getName().replaceAll("blank_", ""),
					img
				);
			}
		}
		for (String imgNum: images.keySet()){
			if (dimensions.containsKey(imgNum)){
				images.get(imgNum).cropImage(dimensions.get(imgNum));
			} 
		}
		
		HashMap<String, String> apiResponse = new Api("couple/us/img", true, request).post(images);
		
		
	}
	
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap<String, String> requestParams = Utils.getRequestParams(request);
		HashMap<String, String> apiResponse = new Api("couple/us/img", true, request).delete(
				new String[0], 
				"imgnums=" + requestParams.get("data")
		);

		
	}
	
	private String extractString(InputStream inputStream) throws IOException {	
		ByteArrayOutputStream baos = new ByteArrayOutputStream();				
		byte[] buffer = new byte[1024];
		int read = 0;
		while ((read = inputStream.read(buffer, 0, buffer.length)) != -1) {
			baos.write(buffer, 0, read);
		}		
		baos.flush();		
		return  new String(baos.toByteArray(), "UTF-8");
	}
	

}
