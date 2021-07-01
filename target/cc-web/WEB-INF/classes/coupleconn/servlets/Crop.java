package com.coupleconn.servlets;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

/**
 * Servlet implementation class Crop
 */
@WebServlet("/crop")
@MultipartConfig()
public class Crop extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Crop() {
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
		Collection<Part> parts = request.getParts();
		for (Part part: parts){
			if (!part.getName().equals("image")){
				String value = extract(part.getInputStream());
			}
		}
	}
	
	
//	YOU HAVE THE PIECES NOW DO THE CROPPING AND OUTPUT IT!!
	
	
	private String extract(InputStream inputStream) throws IOException {	
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
