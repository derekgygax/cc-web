package com.coupleconn.webpages;

import java.io.IOException;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Contact
 */
@WebServlet("/contact")
public class Contact extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Contact() {
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
		String subject = request.getParameter("subject");
        String sender = request.getParameter("emailAddress");
        String messageText = request.getParameter("contactMessage");

        final String username = "donotreply@2couplesconnect.com";
		final String password = "2couplesconnect";

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props,
		  new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		  });
        Message message = new MimeMessage(session);
        try {
        message.setFrom(new InternetAddress(sender));
        message.setRecipients(
          Message.RecipientType.TO, InternetAddress.parse("support@2couplesconnect.com"));
        message.setSubject(subject);
         
        String msg = "Contact Email: " +sender+"<p>" + messageText +"</p>";
         
        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setContent(msg, "text/html");
         
        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(mimeBodyPart);
         
        message.setContent(multipart);
         
        Transport.send(message);
		System.out.println("\nEmail Subject: " +subject+" \nMessage: "+messageText+"\nEmail Sent");

        response.getWriter().append("Email sent");
        } catch(Exception e) {
        	System.out.println(e.getMessage());
        }
	}

}
