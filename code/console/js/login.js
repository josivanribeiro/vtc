function doLogin() {
	var user      = document.getElementById("user-login").value;
	var pass      = document.getElementById("user-pass").value;
	var success   = false;
	var rs        = null;
	var sql       = "";
	var id        = "";
    var sessionId = ""; 	
	if(user != "" && pass != ""){
		openDbConnection();
		rs = new ActiveXObject("ADODB.Recordset");
		sql = "SELECT USR_ID FROM USER_01 WHERE USR_LOGIN = '" + user + "' AND USR_PASS = MD5('" + pass + "') AND USR_STATUS = 1";
		try{
			rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
		}catch(e){
			alert(e.description);
		}		
		if(!rs.bof &&  rs.fields(0).value > 0){
			id = parseInt(rs.fields(0).value);
			success = true;
		}else{
			alert("Login ou Senha incorretos.");
		}				
		rs.close();
		sql = "";
		rs  = null;
	}			
	closeDbConnection();
	if(success){
		sessionId = generateSessionId(id);
		submitPage("form-login", "listPage.htm?sessionId=" + sessionId);
	}			
}

function generateSessionId(p_id){
	var id        = p_id;
	var rs        = null;
	var sql       = "";
	var sessionId = "";
	openDbConnection();
	rs = new ActiveXObject("ADODB.Recordset");
	try{
		sql = "UPDATE USER_01 SET USR_TOKEN = MD5(NOW()) WHERE USR_ID = " + id;
		connection.execute(sql);
		sql = "SELECT USR_TOKEN FROM USER_01 WHERE USR_ID = " + id;
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
		if(!rs.bof){
			sessionId = rs.fields(0).value;
			sessionId += p_id
		}
	}catch(err){
		alert(err.description);
	}
	rs.close();
	rs  = null;
	closeDbConnection();	
	return sessionId;
}

function setSessionId(){		
	document.getElementById("session-id").value = querySt("sessionId");
}

function getSessionId(){
	return querySt("sessionId");
}

function setUserId(){	
	var sessionId  = "";
	sessionId      = querySt("sessionId");
	var indexBegin = null;
	var indexFinal = null;
	var userId     = "";
		
	if(sessionId != null && sessionId.length == 33){		
		sessionId  = new String(sessionId);
		indexBegin = sessionId.length - 1;
		indexFinal = sessionId.length;
		userId     = sessionId.substring(indexBegin, indexFinal);
		document.getElementById("user-id").value = userId;		
	}	
}

function setUserLogin(){
	var userId    = document.getElementById("user-id").value;
	var userLogin = "";
		
	if(userId != null && userId.length > 0){
		userLogin = getUserLoginById(userId);
		document.getElementById("user-login").innerHTML = userLogin;
	}	
}

function sessionConfig(){
	setSessionId();
	setUserId();
	setUserLogin();
	validateSession();	
}

function getUserLoginById(p_id){
	var id    = p_id;
	var rs 	  = null;
	var sql   = "";
    var login = "";
	openDbConnection();	
	rs  = new ActiveXObject("ADODB.Recordset");
    sql = "SELECT USR_LOGIN FROM USER_01 WHERE USR_ID = " + id;
	try{
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
	}catch(err){
		alert(err.description);
	}	
    if(!rs.bof){
      login = rs.fields(0).value;	  
    }
    rs.close();
	closeDbConnection();
	return login;
}

function isValidSession(){
	var sessionId  = getSessionId();
	var userId     = document.getElementById("user-id").value;
	var indexFinal = null;
	if(sessionId != null && sessionId.length == 33){
		indexFinal = sessionId.length - 1;
		sessionId  = sessionId.substring(0, indexFinal);
	}	
	var rs 	       = null;
	var sql        = "";
	var success    = false;		
	if(userId != "" && sessionId != ""){
		openDbConnection();	
		rs  = new ActiveXObject("ADODB.Recordset");
		sql = "SELECT COUNT(*) AS COUNT FROM USER_01 WHERE USR_ID = " + userId + " AND USR_TOKEN = '" + sessionId + "'";
		try{
			rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
		}catch(err){
			alert(err.description);
		}	
		if(!rs.bof && rs.fields(0).value == 1){
		  success = true;	  
		}
		rs.close();
		rs  = null;
		closeDbConnection();
	}		
	return success;
}

function validateSession(){
	if(!isValidSession()){
		logout();
	}
}

function logout(){
	var userId     = document.getElementById("user-id").value;
	var sessionId  = document.getElementById("session-id").value;
	if(userId != "" && sessionId != ""){
		openDbConnection();	
		try{
			sql = "UPDATE USER_01 SET USR_TOKEN = '' WHERE USR_ID = " + userId;
			connection.execute(sql);
		}catch(err){
			alert(err.description);
		}	
		closeDbConnection();
	}
	document.getElementById("user-id").value    = "";
	document.getElementById("session-id").value = "";
	window.location.href = "login.htm";
}
