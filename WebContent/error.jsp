<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>ERROR</title>
</head>
<body>
	<h1>This browser does not support <%=request.getParameter("error") %>, which is required for Couples Connection.</h1>
	<h2>Please use a different browser:</h2>
	<ul>
		<li>
			Chrome
		</li>
		<li>
			Firefox
		</li>
		<li>
			Safari
		</li>
	</ul>
</body>
</html>