package com.coupleconn.data;

import java.awt.Graphics;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.imageio.ImageIO;

public class Image {
	public String fileName;
	public BufferedImage image;
	public String contentType;
	public String imgType;
	
	public Image(){
		// This is just an empty constructor for an empty instance
	}
	
	public Image(String fileName, String contentType, BufferedImage image){
		this.fileName = fileName;
		if (this.fileName.endsWith(".png")){
			this.imgType = "png";
		} else if (this.fileName.endsWith(".jpg") || this.fileName.endsWith(".jpeg")){
			this.imgType = "jpg";
		} 
		this.image = image;
		this.contentType = contentType;
	}
	
	public Image(String urlStr) throws IOException {
		URL url = new URL(urlStr);
		// Retrieve the image type
		HttpURLConnection connection = (HttpURLConnection)  url.openConnection();
		connection.setRequestMethod("HEAD");
		connection.connect();
		String contentType = connection.getContentType();
		
		String imgType = null;
		if (contentType.endsWith("png")){
			imgType = "png";
		} else {
			imgType = "jpg";
		}
		this.fileName = "urlImage." + imgType;
		this.imgType = imgType;
		this.contentType = contentType;
		this.image = ImageIO.read(url);
	}
	
	public void cropImage(String dimesionsString){
		String[] dimensionsArray = dimesionsString.split(",");
		Rectangle rect = new Rectangle();
		rect.setBounds(
			Integer.parseInt(dimensionsArray[0]), 
			Integer.parseInt(dimensionsArray[1]), 
			Integer.parseInt(dimensionsArray[2]), 
			Integer.parseInt(dimensionsArray[3])
		);
		
		BufferedImage subImg = this.image.getSubimage(rect.x, rect.y, rect.width, rect.height);; //fill in the corners of the desired crop location here
		BufferedImage croppedImage = new BufferedImage(subImg.getWidth(), subImg.getHeight(), BufferedImage.TYPE_INT_RGB);
		Graphics g = croppedImage.createGraphics();
		g.drawImage(subImg, 0, 0, null);
		this.image = croppedImage;
		
	}
	
}
