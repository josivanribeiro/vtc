var AD_OPEN_DYNAMIC    = 2
var AD_OPEN_STATIC     = 3
var AD_LOCK_OPTIMISTIC = 3
var CONNECTION_STRING = "DSN=vtc"; 
var connection;
var PAGE_SIZE = 15;
var PATH_CONTENT_FILES = "C:\\CD_OFFLINE_VTC_1_0\\";
//var PATH_CONTENT_FILES = "D:\\vtcrepo\\trunk\\5_Code\\5_1_Implementacao\\";

var ARR_TITLE_EXCEL = new Array(2);
ARR_TITLE_EXCEL[0] = "11_6_Encargos_Sociais";
ARR_TITLE_EXCEL[1] = "11_7_Encargos_com_a_Administracao";

function unCheckAllCheckBoxes(){
	var inputs = document.getElementsByTagName("INPUT");
	var input = null;
	for(var i=0;i<inputs.length; i++){
		input = inputs[i];
		if(input.type == "checkbox"){
			var checkBox = input;
			checkBox.checked = false;			
		}
	}
}

function checkStatusCheckBoxesFromHeader(){
	var checkBoxHeader = document.getElementById("checkbox-header");
	((checkBoxHeader.checked) ? checkAllCheckBoxes():unCheckAllCheckBoxes());	
}

function checkStatusCheckBoxesFromFooter(){
	var checkBoxFooter = document.getElementById("checkbox-footer");
	((checkBoxFooter.checked) ? checkAllCheckBoxes():unCheckAllCheckBoxes());
}

function checkAllCheckBoxes(){
	var inputs = document.getElementsByTagName("INPUT");
	var input = null;
	for(var i=0;i<inputs.length; i++){
		input = inputs[i];
		if(input.type == "checkbox"){
			var checkBox = input;
			checkBox.checked = true;			
		}
	}
}

function deleteGroupRecords(p_sql){
	var inputs  = document.getElementsByTagName("input");
	var input   = null;
	var newSql  = "";	
	openDbConnection();
	for(var i=0;i<inputs.length; i++){
		input = inputs[i];
		if(input.type == "checkbox"){
			var checkBox = input;
			if(checkBox.checked){
				if(checkBox.id != "checkbox-header" 
					&& checkBox.id != "checkbox-footer"){
					var id = checkBox.value;
					newSql = p_sql + id;
					deleteRecord(newSql);
					newSql = "";
				}					
			}
		}
	}
	closeDbConnection();
	alert("Registro(s) excluído(s) com sucesso.");
}

function querySt(ji) {
	hu = window.location.search.substring(1);
	gy = hu.split("&");
	for (i=0;i<gy.length;i++) {
		ft = gy[i].split("=");
		if (ft[0] == ji) {
			return ft[1];
		}
	}	
}

function deleteRecord(p_sql) {
    try{
		connection.execute(p_sql);		
	}catch(err){
		alert(err.description);
		return false;
	}	
}

function existsRecord(p_sql){
	var rs = null;
	try{
		rs = new ActiveXObject("ADODB.Recordset");
		rs.open(p_sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
	}catch(err){
		alert(err.description);
	}
	if(!rs.bof && rs.fields(0).value == 1) {
		return true;
	}
	return false;
}

function submitPage(p_id, p_page){
	document.getElementById(p_id).action = p_page;
	document.getElementById(p_id).submit();			
}

function openDbConnection(){
	try {
		if (connection == null){
			connection = new ActiveXObject("ADODB.Connection");
			connection.Open(CONNECTION_STRING, "", "");
		}		
	} catch(err) {
		alert(err.description);
	}				
}

function closeDbConnection(){
	try{
		if(connection != null && connection.State == 1){
			connection.Close;
			connection = null;
		}		
	}catch(err){
		alert(err.description);
	}	
}

function isEmptyField(str) {
  str = cleanWhiteSpaceAll(str);
  if (str==null || str=="")
    return true;
  return false;
}

function cleanWhiteSpaceAll(str){
  if (str!=null){
    while (str.length > 0 &&
      "\n\r\t ".indexOf(str.charAt(str.length - 1)) != -1)
      str = str.substring(0, str.length - 1);
    while (str.length > 0 &&
      "\n\r\t ".indexOf(str.charAt(0)) != -1)
      str = str.substring(1, str.length);
  }
  return str;
}

function updateFieldTitle(){
	var selectedSpan = getSelectedMenu().nextSibling.nextSibling;
	var newTitle = selectedSpan.innerHTML;
	document.getElementById("title").value = newTitle;
}

function replaceEspecialCharacter(p_str){
	var str = p_str;
	str = str.replace("á","a");
	str = str.replace("â","a");
	str = str.replace("à","a");
	str = str.replace("ã","a");
	str = str.replace("ç","c");
	str = str.replace("é","e");
	str = str.replace("ê","e");
	str = str.replace("í","i");
	str = str.replace("ó","o");
	str = str.replace("ô","o");
	str = str.replace("õ","o");
	str = str.replace("ú","u");
	str = str.replace("ü","u");
	str = str.replace("ü","u");
	str = str.replace("Á","A");
	str = str.replace("Â","A");
	str = str.replace("À","A");
	str = str.replace("Ã","A");
	str = str.replace("Ç","C");
	str = str.replace("É","E");
	str = str.replace("Ê","E");
	str = str.replace("Í","I");
	str = str.replace("Ó","O");
	str = str.replace("Ô","O");
	str = str.replace("Õ","O");
	str = str.replace("Ú","U");
	str = str.replace("Ü","U");
	return str;
}

function replaceNonBreakingSpace(p_str){
	var str = p_str;
	var regExprNonBreakingSpace = new RegExp("&nbsp;");
	while(regExprNonBreakingSpace.test(str)){
		str = str.replace("&nbsp;","");
	}
	return str;
}

function replaceDotAndWhiteSpace(p_str){
	var str = p_str;
	var regExprTwoUnderline = new RegExp("__");
	while(str.indexOf(".") != -1){
		str = str.replace(".","_");
	}
	while(str.indexOf(" ") != -1){
		str = str.replace(" ","_");
	}
	while(str.indexOf("-") != -1){
		str = str.replace("-","_");
	}
	while(str.indexOf(":") != -1){
		str = str.replace(":","_");
	}
	while(str.indexOf("/") != -1){
		str = str.replace("/","_");
	}
	while(regExprTwoUnderline.test(str)){
		str = str.replace("__","_");
	}
	return str;
}

function formatNameFile(p_str){
	var str = p_str;
	str = replaceEspecialCharacter(str);
	str = replaceDotAndWhiteSpace(str);
	return str;
}

function getDataPagination(p_sql){
	var rs 	         = null;
	var sql          = p_sql;
    var totalRecords = 0;
	var totalPages   = 0;
	var data         = null;    
	openDbConnection();	
	rs = new ActiveXObject("ADODB.Recordset");
    try{
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);		
	}catch(err){
		alert(err.description);
	}	
    if(!rs.bof) {
      totalRecords = parseInt(rs.fields(0).value);
	  totalPages   = (totalRecords / PAGE_SIZE);
	  totalPages   = roundValue(totalPages);
	  if(totalPages == 0){
		totalPages = 1;
	  }
	  data = new Array(totalRecords, totalPages);
    }
    rs.close();
	closeDbConnection();
	return data;
}

function roundNumber(number,decimals) {
	var newString;// The new rounded number
	decimals = Number(decimals);
	if (decimals < 1) {
		newString = (Math.round(number)).toString();
	} else {
		var numString = number.toString();
		if (numString.lastIndexOf(".") == -1) {// If there is no decimal point
			numString += ".";// give it one at the end
		}
		var cutoff = numString.lastIndexOf(".") + decimals;// The point at which to truncate the number
		var d1 = Number(numString.substring(cutoff,cutoff+1));// The value of the last decimal place that we'll end up with
		var d2 = Number(numString.substring(cutoff+1,cutoff+2));// The next decimal, after the last one we want
		if (d2 >= 5) {// Do we need to round up at all? If not, the string will just be truncated
			if (d1 == 9 && cutoff > 0) {// If the last digit is 9, find a new cutoff point
				while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
					if (d1 != ".") {
						cutoff -= 1;
						d1 = Number(numString.substring(cutoff,cutoff+1));
					} else {
						cutoff -= 1;
					}
				}
			}
			d1 += 1;
		} 
		if (d1 == 10) {
			numString = numString.substring(0, numString.lastIndexOf("."));
			var roundedNum = Number(numString) + 1;
			newString = roundedNum.toString() + '.';
		} else {
			newString = numString.substring(0,cutoff) + d1.toString();
		}
	}
	if (newString.lastIndexOf(".") == -1) {// Do this again, to the new string
		newString += ".";
	}
	var decs = (newString.substring(newString.lastIndexOf(".")+1)).length;
	for(var i=0;i<decimals-decs;i++) newString += "0";
	//var newNumber = Number(newString);// make it a number if you like
	return newString;	
}

function roundValue(p_number){
	var newString     = "";
	var roundedNumber = 0;
	newString = (Math.round(p_number)).toString();
	if(newString.lastIndexOf(".") == -1){
		roundedNumber = Number(newString) + 1;
	}else{
		roundedNumber = p_number;
	}
	return roundedNumber;
}

function redirect(p_page){
	var url = p_page + "?sessionId=" + getSessionId();
	window.location.href = url;
}

function isAExcelItem(p_title){
	var title = p_title;
	var excelTitle = "";
	var isAExcelItem = false;
	for(var i=0;i<ARR_TITLE_EXCEL.length;i++){
		excelTitle = ARR_TITLE_EXCEL[i];
		if(excelTitle == title){
			isAExcelItem = true;
		}
	}
	return isAExcelItem;
}

function getTitleExcelItem(p_title){
	var title = p_title;
	var excelTitle = "";
	for(var i=0;i<ARR_TITLE_EXCEL.length;i++){
		excelTitle = ARR_TITLE_EXCEL[i];
		if(excelTitle == title){
			return excelTitle;
		}
	}	
}
