package com.coupleconn.util;


import java.util.Properties;


import java.io.*;

public class Config {
   static String configFile = "CoupleConn.properties";
   static Properties props = null;
   
   public static void setConfigFile(String name) {
	   configFile = name;
   }
   
   public static String getProperty(String key) {
   
      if (props == null) {	
   	     try{ 
   	     	 ClassLoader loader = (new Config()).getClass().getClassLoader();
   	     	 props = new Properties();
   		     props.load( loader.getResourceAsStream (configFile)); 
   	     }catch(IOException ie){ 
   	     } 
      }
      
      return props.getProperty(key);
   }
}

