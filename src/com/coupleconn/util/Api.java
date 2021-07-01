package com.coupleconn.util;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.HashMap;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.coupleconn.data.Image;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

public class Api {
	
	private String ccHost = null;
	private String password;
	private String token; 
	boolean needsAuth;
	StringBuffer url = null;

	public Api(String servlet, boolean needsAuth, HashMap<String, String> userPassword){
		this.ccHost = System.getenv("API_URL");
		this.needsAuth = needsAuth;
		this.url = new StringBuffer(ccHost);
		this.url.append(servlet);
	}
	
	public Api(String servlet, boolean needsAuth, HttpServletRequest request){
		if (needsAuth){
			HttpSession session = request.getSession(false);
			HashMap<String, String> userLoggedIn = (HashMap<String, String>) session.getAttribute("userLoggedIn");
			this.password = userLoggedIn.get("password");
			this.token = userLoggedIn.get("token");
		}
		this.ccHost = System.getenv("API_URL");
		this.url = new StringBuffer(ccHost);
		this.url.append(servlet);
		this.needsAuth = needsAuth;
	}
	
	private String getBase64Encoded(){
		String authString = this.token;
		byte[] authEncBytes = Base64.getEncoder().encode(authString.getBytes());
		String authStringEnc = new String(authEncBytes);
		return authStringEnc;
	}
	private void setAuthHeader(HttpGet httpConnection){
		if (this.needsAuth){
			httpConnection.setHeader("Authorization", "Basic " + getBase64Encoded());
		}
	}
	private void setAuthHeader(HttpPost httpConnection){
		if (this.needsAuth){
			httpConnection.setHeader("Authorization", "Basic " + getBase64Encoded());
		}
	}
	private void setAuthHeader(HttpDelete httpConnection){
		if (this.needsAuth){
			httpConnection.setHeader("Authorization", "Basic " + getBase64Encoded());
		}
	}
	
	private void extendUrlPath(String[] pathExtensions){
		if (pathExtensions != null){
			for (String extension: pathExtensions){
				this.url.append("/" + extension);
			}
		}
	}
	
	private void addKeyValueParameters(HashMap<String, String> parameters) throws UnsupportedEncodingException{
		int i = 0;
		for (String key: parameters.keySet()){
			if (i == 0){
				this.url .append("?");
			} else {
				this.url .append("&");
			}
			this.url.append(key + "=" + URLEncoder.encode(parameters.get(key), "UTF-8"));
			i++;
		}	
	}
	
	private HashMap<String, String> processResponse(HttpResponse httpResponse) throws IOException {
		HashMap<String, String> response = new HashMap<String, String>();
		int statusCode = httpResponse.getStatusLine().getStatusCode();
		response.put("status", String.valueOf(statusCode));
		String responseValue = EntityUtils.toString(httpResponse.getEntity());
		if (statusCode != 200){
			System.err.println(statusCode);
			System.err.println(responseValue);
			response.put("text", responseValue);
//			throw new IOException();
		} else {
			response.put("text", responseValue);
		}
		return response;
	};
	
	public HashMap<String, String> get(String[] pathExtensions, String paramStr) throws IOException{
		ObjectMapper objectMapper = new ObjectMapper();
		HashMap<String, String> parameters = objectMapper.readValue(paramStr, new TypeReference<HashMap<String, String>>(){});
		HashMap<String, String> response = get(pathExtensions, parameters);
		return response;
	}

	public HashMap<String, String> get(String[] pathExtensions, HashMap<String, String> parameters) throws IOException{
		HashMap<String, String> response = null;
		HttpClient httpclient = null;
		try {
			httpclient = new DefaultHttpClient();
			// Build url
			extendUrlPath(pathExtensions);
			addKeyValueParameters(parameters);
			// Setup connection
			HttpGet httpGet = new HttpGet(this.url.toString());
			setAuthHeader(httpGet);
			// Execute request
			HttpResponse httpResponse = httpclient.execute(httpGet);
			// Process response
			response = processResponse(httpResponse);
            
		} finally {
			try{
				httpclient.getConnectionManager().shutdown();
			} catch (Exception e){} 
		}
		return response;
	}
	
	public HashMap<String, String> postWith(String[] pathExtensions, HashMap<String, String> parameters) throws IOException{
		HashMap<String, String> response = null;
		HttpClient httpclient = null;
		try {
			httpclient = new DefaultHttpClient();
			// Build url
			extendUrlPath(pathExtensions);
			addKeyValueParameters(parameters);
			// Setup connection
			HttpPost httpPost = new HttpPost(this.url.toString());

			setAuthHeader(httpPost);
			// Execute request
			HttpResponse httpResponse = httpclient.execute(httpPost);
			// Process response
			response = processResponse(httpResponse);
            
		} finally {
			try{
				httpclient.getConnectionManager().shutdown();
			} catch (Exception e){} 
		}
		return response;
	}
	
	public HashMap<String, String> post(String pathExtensionsStr, String paramStr) throws IOException{
		ObjectMapper pathObjectMapper = new ObjectMapper();
		String[] pathExtensions = pathObjectMapper.readValue(pathExtensionsStr, String[].class);
		
		HashMap<String, String> response = post(pathExtensions, paramStr);
		return response;
	}
	
	public HashMap<String, String> post(String[] pathExtensions, String data) throws IOException {
		HashMap<String, String> response = null;
		HttpClient httpclient = null;
		try {
			httpclient = new DefaultHttpClient();
			// Build url
			extendUrlPath(pathExtensions);
			// Setup connection
			HttpPost httpPost = new HttpPost(this.url.toString());
			setAuthHeader(httpPost);
			// Put data in request
			httpPost.setEntity(new StringEntity(data));
			// Execute request
			HttpResponse httpResponse = httpclient.execute(httpPost);
			// Get response
			response = processResponse(httpResponse);
			
		} finally {
			try{
				httpclient.getConnectionManager().shutdown();
			} catch (Exception e){} 
		}
		return response;
		
	}
	
	public HashMap<String, String> post(HashMap<String, Image> images) throws IOException {
		HashMap<String, String> response = null;
		CloseableHttpClient httpclient = null;
		try {
			httpclient = HttpClients.createDefault();
			// Setup connection
			HttpPost httpPost = new HttpPost(this.url.toString());
			
			setAuthHeader(httpPost);
			
			MultipartEntityBuilder builder = MultipartEntityBuilder.create();
			for (String imgNum: images.keySet()){
				Image img = images.get(imgNum);
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				ImageIO.write(img.image, img.imgType, baos);
				builder.addBinaryBody(
					imgNum, 
					baos.toByteArray(),
					ContentType.create(img.contentType), 
					img.fileName
				);
			}

			
			HttpEntity multipart = builder.build();
			httpPost.setEntity(multipart);
			CloseableHttpResponse httpResponse = httpclient.execute(httpPost);
			
			response = processResponse(httpResponse);
			
			
		} finally {
			try{
				httpclient.close();
			} catch (Exception e){} 
		}	
		return response;
	}
	
	public HashMap<String, String> delete(String[] pathExtensions, String data) throws IOException {
		HashMap<String, String> response = null;
		CloseableHttpClient httpclient = null;
		try {
			httpclient = HttpClients.createDefault();
			// Build url
			extendUrlPath(pathExtensions);
			this.url.append("?" + data);
			// Setup connection
			HttpDelete httpDelete = new HttpDelete(this.url.toString());
			setAuthHeader(httpDelete);
			// Execute request
			HttpResponse httpResponse = httpclient.execute(httpDelete);
			// Get response
			response = processResponse(httpResponse);
			
		} finally {
			try{
				httpclient.close();
			} catch (Exception e){} 
		}
		return response;
		
	}
}
