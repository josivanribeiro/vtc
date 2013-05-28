function deleteGroupPages(){
	var sql = "DELETE FROM PAGE_03 WHERE PG_ID = ";
	deleteGroupRecords(sql);	
}

function deletePage(p_id){
	var sql = "DELETE FROM PAGE_03 WHERE PG_ID = " + p_id;
	openDbConnection();
	try{
		deleteRecord(sql);
	}catch(err){
		alert(err.description);
		return false;
	}	
	alert("Registro excluido com sucesso.");
	closeDbConnection();
	return true;
}

function getListPage(p_startPage){
	var html            = "";
	var rs              = null;
	var rs2             = null;
	var rs3             = null;
	var sql             = "";
	var sql2            = "";
	var idPage          = "";
	var idMenu0         = "";
	var idMenu1         = "";
	var idMenu2         = "";
	var titlePage       = "";
	var statusPage      = "";
	var arrIdMenu       = null;
	var arrHtmlPage     = null;
	var startPagination = parseInt(p_startPage);
	var endPagination   = startPagination + PAGE_SIZE - 1;
	var isFirst0        = false;
	openDbConnection();
	sql =  "SELECT M.MN_ID, M.MN_PAI "
	sql += "FROM PAGE_03 P "
	sql += "INNER JOIN MENU_02 M ON P.MN_ID = M.MN_ID "
	sql += "WHERE M.MN_PAI IS NULL "
	sql += "ORDER BY P.PG_ID";
	try{
		rs = new ActiveXObject("ADODB.Recordset");
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
	}catch(err){
		alert(err.description);
	}	
    if(!rs.bof){
      rs.MoveFirst();
      arrIdMenu = new Array();
	  while(!rs.eof) {
        idMenu = rs.fields(0).value;
		arrIdMenu.push(idMenu);
		rs.MoveNext();
      }	  
    }	
	try{		
		if(arrIdMenu != null && arrIdMenu.length > 0){			
			arrHtmlPage = new Array();
			for(var i=0;i<arrIdMenu.length;i++){			
				idMenu0 = arrIdMenu[i];				
				sql2   = "SELECT P.PG_ID, P.PG_TITLE, P.PG_STATUS, M.MN_ID ";
				sql2  += "FROM PAGE_03 P ";
				sql2  += "INNER JOIN MENU_02 M ON P.MN_ID = M.MN_ID ";
				sql2  += "WHERE M.MN_PAI = " + idMenu0 + " OR M.MN_ID = " + idMenu0 + " ";
				sql2  += "ORDER BY M.MN_PAI, M.MN_ID";
				rs2 = new ActiveXObject("ADODB.Recordset");
				rs2.open(sql2, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
				if(!rs2.bof){				  
					rs2.MoveFirst();
					isFirst0 = true;
					while(!rs2.eof){
						idPage     = rs2.fields(0).value;
						titlePage  = rs2.fields(1).value;
						statusPage = rs2.fields(2).value;
						idMenu1    = rs2.fields(3).value;							
						if(isFirst0){
							html = "<tr valign='top'>";
							html += "	<th scope='row' class='check-column'>";
							html += "		<input type='checkbox' value='" + idPage + "' />";
							html +=	"	</th>";
							html +=	"	<td class='post-title column-title'>";
							html +=	"		<strong><a class='row-title' href='detailPage.htm?idPage=" + idPage + "&sessionId=" + getSessionId() + "'>" + titlePage + "</a></strong>";
							html +=	"	</td>";
							html +=	"	<td class='tags column-tags'>" + ((statusPage == "1") ? 'Ativo':'Inativo') + "</td>";
							html += "</tr>";						
							
							arrHtmlPage.push(html);
							html = "";
							isFirst0 = false;
						}else if(idMenu0 != idMenu1){
							html = "<tr valign='top'>";
							html += "	<th scope='row' class='check-column'>";
							html += "		<input type='checkbox' value='" + idPage + "' />";
							html +=	"	</th>";
							html +=	"	<td class='post-title column-title'>";
							html +=	"		<strong><a class='row-title' href='detailPage.htm?idPage=" + idPage + "&sessionId=" + getSessionId() + "'>" + titlePage + "</a></strong>";
							html +=	"	</td>";
							html +=	"	<td class='tags column-tags'>" + ((statusPage == "1") ? 'Ativo':'Inativo') + "</td>";
							html += "</tr>";						
							
							arrHtmlPage.push(html);
							html = "";
							
							sql3   = "SELECT P.PG_ID, P.PG_TITLE, P.PG_STATUS, M.MN_ID ";
							sql3  += "FROM PAGE_03 P ";
							sql3  += "INNER JOIN MENU_02 M ON P.MN_ID = M.MN_ID ";
							sql3  += "WHERE M.MN_PAI = " + idMenu1 + " OR M.MN_ID = " + idMenu1 + " ";
							sql3  += "ORDER BY M.MN_PAI, M.MN_ID";
							
							rs3 = new ActiveXObject("ADODB.Recordset");
							rs3.open(sql3, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
							if(!rs3.bof){				  
								rs3.MoveFirst();
								while(!rs3.eof){
									idPage     = rs3.fields(0).value;
									titlePage  = rs3.fields(1).value;
									statusPage = rs3.fields(2).value;
									idMenu2    = rs3.fields(3).value;									
									if(idMenu1 != idMenu2){
										html = "<tr valign='top'>";
										html += "	<th scope='row' class='check-column'>";
										html += "		<input type='checkbox' value='" + idPage + "' />";
										html +=	"	</th>";
										html +=	"	<td class='post-title column-title'>";
										html +=	"		<strong><a class='row-title' href='detailPage.htm?idPage=" + idPage + "&sessionId=" + getSessionId() + "'>" + titlePage + "</a></strong>";
										html +=	"	</td>";
										html +=	"	<td class='tags column-tags'>" + ((statusPage == "1") ? 'Ativo':'Inativo') + "</td>";
										html += "</tr>";						
										arrHtmlPage.push(html);
										idPage     = "";
										titlePage  = "";
										statusPage = "";
										idMenu2    = "";
										html       = "";
									}									
									rs3.MoveNext();
								}
							}
						}						
						idPage     = "";
						titlePage  = "";
						statusPage = "";
						idMenu1    = "";
						rs2.MoveNext();			
					}					
				}
				idMenu0 = "";
			}		
			
			if(arrHtmlPage != null && arrHtmlPage.length > 0){
				for(var i=startPagination;i<=endPagination;i++){
					if(arrHtmlPage[i] != undefined){
						html += arrHtmlPage[i];
					}					
				}
				document.write(html);
			}			
		}			
	}catch(err){
		alert(err.description);
	}	
    rs3.close();
	rs2.close();
	rs.close();
	closeDbConnection();    
}

function getSortedListPage(){
	var html              = "";
	var rs                = null;
	var rs2               = null;
	var rs3               = null;
	var sql               = "";
	var sql2              = "";
	var idPage            = "";
	var idMenu            = "";
	var idMenu0           = "";
	var idMenu1           = "";
	var idMenu2           = "";
	var titlePage         = "";
	var arrIdMenu         = null;
	var arrPage           = null;
	var arrSortedListPage = null;
	var isFirst0        = false;
	openDbConnection();
	sql =  "SELECT M.MN_ID, M.MN_PAI "
	sql += "FROM PAGE_03 P "
	sql += "INNER JOIN MENU_02 M ON P.MN_ID = M.MN_ID "
	sql += "WHERE M.MN_PAI IS NULL "
	sql += "ORDER BY P.PG_ID";
	try{
		rs = new ActiveXObject("ADODB.Recordset");
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
	}catch(err){
		alert(err.description);
	}	
    if(!rs.bof){
      rs.MoveFirst();
      arrIdMenu = new Array();
	  while(!rs.eof) {
        idMenu = rs.fields(0).value;
		arrIdMenu.push(idMenu);
		rs.MoveNext();
      }	  
    }	
	try{		
		if(arrIdMenu != null && arrIdMenu.length > 0){			
			arrSortedListPage = new Array();
			for(var i=0;i<arrIdMenu.length;i++){			
				idMenu0 = arrIdMenu[i];				
				sql2   = "SELECT P.PG_ID, P.PG_TITLE, M.MN_ID ";
				sql2  += "FROM PAGE_03 P ";
				sql2  += "INNER JOIN MENU_02 M ON P.MN_ID = M.MN_ID ";
				sql2  += "WHERE M.MN_PAI = " + idMenu0 + " OR M.MN_ID = " + idMenu0 + " ";
				sql2  += "ORDER BY M.MN_PAI, M.MN_ID";
				rs2 = new ActiveXObject("ADODB.Recordset");
				rs2.open(sql2, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
				if(!rs2.bof){				  
					rs2.MoveFirst();
					isFirst0 = true;
					while(!rs2.eof){
						idPage     = rs2.fields(0).value;
						titlePage  = rs2.fields(1).value;
						idMenu1    = rs2.fields(2).value;							
						if(isFirst0){
							arrPage = new Array(2);
							arrPage[0] = idPage;
							arrPage[1] = titlePage;
							arrSortedListPage.push(arrPage);
							isFirst0 = false;
						}else if(idMenu0 != idMenu1){
							arrPage = new Array(2);
							arrPage[0] = idPage;
							arrPage[1] = titlePage;
							arrSortedListPage.push(arrPage);
														
							sql3   = "SELECT P.PG_ID, P.PG_TITLE, M.MN_ID ";
							sql3  += "FROM PAGE_03 P ";
							sql3  += "INNER JOIN MENU_02 M ON P.MN_ID = M.MN_ID ";
							sql3  += "WHERE M.MN_PAI = " + idMenu1 + " OR M.MN_ID = " + idMenu1 + " ";
							sql3  += "ORDER BY M.MN_PAI, M.MN_ID";
							
							rs3 = new ActiveXObject("ADODB.Recordset");
							rs3.open(sql3, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
							if(!rs3.bof){				  
								rs3.MoveFirst();
								while(!rs3.eof){
									idPage     = rs3.fields(0).value;
									titlePage  = rs3.fields(1).value;
									idMenu2	   = rs3.fields(2).value;
									if(idMenu1 != idMenu2){
										arrPage = new Array(2);
										arrPage[0] = idPage;
										arrPage[1] = titlePage;
										arrSortedListPage.push(arrPage);
									}									
									rs3.MoveNext();
								}
							}
						}						
						idPage     = "";
						titlePage  = "";
						idMenu1    = "";
						rs2.MoveNext();			
					}					
				}
				idMenu0 = "";
			}				
		}			
	}catch(err){
		alert(err.description);
	}	
    rs2.close();
	rs.close();
	closeDbConnection();
	return arrSortedListPage;
}

function getPageById(p_id){
	var rs 		    = null;
	var sql 	    = "";
    var idPage      = "";
	var idMenu      = "";
	var titlePage   = "";
	var contentPage = "";
	var statusPage  = false;
	openDbConnection();	
	rs = new ActiveXObject("ADODB.Recordset");
    sql = "SELECT PG_ID, MN_ID, PG_TITLE, SUBSTRING(PG_CONTENT,1,200000) AS CONTENT, PG_STATUS FROM PAGE_03 WHERE PG_ID = " + p_id;
	try{
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
	}catch(err){
		alert(err.description);
	}	
    if(!rs.bof){
      idPage      = rs.fields(0).value;
	  idMenu      = rs.fields(1).value;
	  titlePage   = rs.fields(2).value;
	  contentPage = rs.fields(3).value;
	  statusPage  = ((rs.fields(4).value == "1") ? true : false);
	  loadFieldsPage(idPage, idMenu, titlePage, contentPage, statusPage);
    }
    rs.close();
	closeDbConnection();    
}

function loadFieldsPage(p_idPage, p_idMenu, p_titlePage, p_contentPage, p_statusPage){
	document.getElementById("page-id").value = p_idPage;
	document.getElementById("title").value   = p_titlePage;
	document.getElementById("content").value = p_contentPage;
	setMenuId(p_idMenu);
	document.getElementById("page-status").checked = p_statusPage;	
}

function loadDataPage(){
	var idPage = querySt("idPage");
	getPageById(idPage);
}

function updatePage(p_id){
    var id          = p_id;
	var sql         = "";
	var msg         = "";
    var pageTitle   = document.getElementById("title").value;
	var pageContent = tinyMCE.activeEditor.getContent({format : 'raw'});
	pageContent     = replaceNonBreakingSpace(pageContent);
	var menuId      = getMenuId();
	var pageStatus  = ((document.getElementById("page-status").checked) ? 1 : 0);
	var success     = true;
	openDbConnection();	
	if(id != ""){
		//Sql used to double check if already exists a record for the given id
		sql = "SELECT COUNT(*) AS COUNT FROM PAGE_03 WHERE PG_ID = " + id;
		//If the record already exists, it will be updated into database
		if(existsRecord(sql)){
			sql = "";
			sql = "UPDATE PAGE_03 SET PG_TITLE = '" + pageTitle + "', MN_ID = " + menuId + ", PG_CONTENT = '" + pageContent + "', PG_STATUS = " + pageStatus + " WHERE PG_ID = " + id;
			msg = "Registro atualizado com sucesso.";
		}		
	} else { //Otherwise, a new record will be inserted into database
		sql = "";
		sql = "INSERT INTO PAGE_03(PG_TITLE, MN_ID, PG_CONTENT, PG_STATUS) VALUES ('" + pageTitle + "', " + menuId + ", '" + pageContent + "', " + pageStatus + ")";
		msg = "Registro adicionado com sucesso.";
	}	
	try{
		if(isAvailableMenu(id, menuId)){
			connection.execute(sql);
			alert(msg);
		} else {
			success = false;
		}		
	}catch(err){
		alert(err.description);
	}
	closeDbConnection();
	return success;
}
  
function getPreviousFileName(p_currentId){
	var id         = p_currentId;
	var listSorted = getSortedListPage();
	var arrPage    = null;
	var idPage     = "";
	var titlePage  = "";
	var count      = null;
	for(var i=0;i<listSorted.length;i++){
		arrPage = listSorted[i];
		if(arrPage != null && arrPage.length > 0){
			idPage    = arrPage[0];
			if(idPage == id){
				count = i;
				do{
					arrPage   = null;
					arrPage   = listSorted[count - 1];
					titlePage = arrPage[1];
					fileName = formatNameFile(titlePage);
					count--;
				}while(isAExcelItem(fileName))
			}			
		}
	}
	if(fileName != "" && !isAExcelItem(fileName)){
		fileName += ".htm"; 
	}	
	return fileName;		
}

function getNextFileName(p_currentId){
	var id         = p_currentId;
	var listSorted = getSortedListPage();
	var arrPage    = null;
	var idPage     = "";
	var titlePage  = "";
	var count      = null;
	for(var i=0;i<listSorted.length;i++){
		arrPage = listSorted[i];
		if(arrPage != null && arrPage.length > 0){
			idPage    = arrPage[0];
			if(idPage == id){
				count = i;
				do{
					arrPage   = null;
					arrPage   = listSorted[count + 1];
					titlePage = arrPage[1];
					fileName = formatNameFile(titlePage);
					count++;
				}while(isAExcelItem(fileName))
			}			
		}
	}
	if(fileName != "" && !isAExcelItem(fileName)){
		fileName += ".htm"; 
	}	
	return fileName;
}
  
/*function getPreviousFileName(p_currentId){
	var id       = parseInt(p_currentId) - 1;
	var data     = null;
	var title    = "";
	var fileName = "index.htm"; //default
	do{
		data = getPageDataById(id);
		id--;
	}while(data == null && id > 1)
	
	if(data != null){
		title    = data[0]; 
		fileName = formatNameFile(title) + ".htm"; 
	}
	
	return fileName;	
}
*/

/*function getNextFileName(p_currentId){
	var id       = parseInt(p_currentId) + 1;
	var data     = null;
	var title    = "";
	var fileName = "index.htm"; //default
	var count    = 0;
	do{
		data = getPageDataById(id);
		id++;
		count++;
	}while(data == null && count < 3)
	
	if(data != null){
		title    = data[0]; 
		fileName = formatNameFile(title) + ".htm"; 
	}
	
	return fileName;	
}
*/
  
function exportHTMLFileFromDb() {
	var id                = querySt("idPage");
	var data              = getPageDataById(id);
	var titlePage         = data[0];
	var contentPage       = data[1];
	var fileNamePrevious  = getPreviousFileName(id);
	var fileNameNext      = getNextFileName(id);
	var fileName          = formatNameFile(titlePage) + ".htm";
	var html   		      = "";
	var fso  		      = null;    
	var file 		      = "";
	var fh 			      = "";
		
	html += "<html xmlns='http://www.w3.org/1999/xhtml' dir='ltr' lang='pt-BR'>\n";
	html += "<head>\n";
	html += "	<title>Vilson Trevisan Consultoria - Manual de Orienta&ccedil&atilde;o para Controle de Custos</title>\n";
	html += "<link rel='stylesheet' href='css/style.css' type='text/css' media='Screen'>\n";
	html += "</head>\n";
	html += "<body>\n";
	html += "<div id='main'>\n";
	html += 	"<div id='header'></div>\n";
	html +=		"<div class='menu'>\n";
	html +=			"<ul>\n";
	html += 			"<li><div></div></li>\n";
	html += 			"<li>\n";
	html += 				"<ul>\n";
	html += 					"<li><a href='home.htm'><img src='images/buttonInicio.gif' height='26px' width='100px' border='0' onmouseover=this.src='images/buttonInicioOver.gif'; onmouseout=this.src='images/buttonInicio.gif'; /></a></li>\n";
	html += 					"<li><a href='index.htm'><img src='images/buttonIndice.gif' height='26px' width='100px' border='0' onmouseover=this.src='images/buttonIndiceOver.gif'; onmouseout=this.src='images/buttonIndice.gif'; /></a></li>\n";
	html += 					"<li><a href='" + fileNamePrevious + "'><img src='images/buttonAnterior.gif' height='26px' width='100px' border='0' onmouseover=this.src='images/buttonAnteriorOver.gif'; onmouseout=this.src='images/buttonAnterior.gif'; /></a></li>\n";
	html += 					"<li><a href='" + fileNameNext + "'><img src='images/buttonProximo.gif' height='26px' width='100px' border='0' onmouseover=this.src='images/buttonProximoOver.gif'; onmouseout=this.src='images/buttonProximo.gif'; /></a></li>\n";
	html += 				"</ul>\n";				
	html += 			"</li>\n";
	html += 		"</ul>\n";
	html += 	"</div>\n";			
	html +=		"<div id='page'>\n";					
	html +=			"<div class='page-top'></div>\n";				
	html += 		"<div class='page'>\n";						
	html += 			"<h1>" + titlePage + "</h1>\n";
	html += 			"<div class='page-content-top'></div>\n";						
	html += 			"<div class='page-content'>\n";																				
	html +=             	"<p>\n";
	html += 					contentPage;
	html +=                 "</p>\n";
	html += 				"<p class='top-page-content'><img src='images/topArrow.gif' /> <a href='#top'>topo</a></p>\n";	
	html += 			"</div>\n";
	html += 			"<div class='page-content-bottom'></div>\n";															
	html += 		"</div>\n";					
	html += 		"<div class='page-bottom'></div>\n";							
	html += 	"</div>\n";			
	html += 	"<div id='#footer'>\n";
	html += 		"<p class='copyright'>\n";
	html += 			"Vilson Trevisan Consultoria &copy 2009. Todos os direitos reservados. Este site é melhor visualizado em Internet Explorer 8.\n";
	html += 		"</p>\n";	
	html += 	"</div>\n";		
	html += "</div>\n";		
	html += "</body>\n";	
	html += "</html>\n";
	try{
		fso  = new ActiveXObject("Scripting.FileSystemObject"); 
		file = PATH_CONTENT_FILES + fileName;
		fh   = fso.CreateTextFile(file, true); 
		fh.WriteLine(html); 
		fh.Close();
		alert("Arquivo HTML exportado com sucesso.");
	}catch(err){
		alert(err.description);
	}		
}

function processPage(){
	var action = document.getElementById("action");	
	if(action.options[action.selectedIndex].value == "delete"){
		deleteGroupPages();
	}
}

function getPageDataById(p_id){
	var rs 		    = null;
	var sql 	    = "";
    var titlePage   = "";
	var contentPage = "";
	var data = null;
	openDbConnection();	
	rs = new ActiveXObject("ADODB.Recordset");
    sql = "SELECT PG_TITLE, SUBSTRING(PG_CONTENT,1,200000) AS CONTENT FROM PAGE_03 WHERE PG_ID = " + p_id;
	try{
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
	}catch(err){
		alert(err.description);
	}	
    if(!rs.bof){
      titlePage   = rs.fields(0).value;
	  contentPage = rs.fields(1).value;
	  data = new Array(titlePage, contentPage);
    }
    rs.close();
	closeDbConnection();
	return data;
}

function configPaginationPage(){
	var data = null;
	var sql  = "SELECT COUNT(*) AS TOTAL FROM PAGE_03";
	data     = getDataPagination(sql);
	return data;
}

function configFooterPagination(p_totalPages, p_page){
	var totalPages = p_totalPages;
	var page       = p_page;
	var html       = "";

	if(totalPages > 1){
		if(page > 1){
			html += "<th scope='col' class='manage-column'><a href='listPage.htm?page=1&sessionId=" + getSessionId() + "'><img src='images/arrow_first.gif' /></a></th>\n";
			html += "<th scope='col' class='manage-column'><a href='listPage.htm?page=" + (page - 1) + "&sessionId=" + getSessionId() + "'><img src='images/arrow_previous.gif' /></a></th>\n";
		}		
		if(page < totalPages){
			html += "<th scope='col' class='manage-column'><a href='listPage.htm?page=" + (page + 1) + "&sessionId=" + getSessionId() + "'><img src='images/arrow_next.gif' /></a></th>\n";
			html += "<th scope='col' class='manage-column'><a href='listPage.htm?page=" + totalPages + "&sessionId=" + getSessionId() + "'><img src='images/arrow_last.gif' /></a></th>\n";
		}												
	}
	document.write(html);
}
