
function isMenuLevel0(p_str){
	var str = p_str.substring(0,7);
	var regExpr1 = new RegExp("^[0-9]\. [A-Za-z0-9]");
	var regExpr2 = new RegExp("^[0-9][0-9]\. [A-Za-z0-9]");
	return(regExpr1.test(str) || regExpr2.test(str));		
}

function isMenuLevel1(p_str){
	var str = p_str.substring(0,7);
	var regExpr1 = new RegExp("^[0-9]\. [A-Za-z0-9]");
	var regExpr2 = new RegExp("^[0-9]\.[0-9] [A-Za-z0-9]");
	var regExpr3 = new RegExp("^[0-9]\.[0-9][0-9] [A-Za-z0-9]");
	var regExpr4 = new RegExp("^[0-9][0-9]\.[0-9] [A-Za-z0-9]");
	var regExpr5 = new RegExp("^[0-9][0-9]\.[0-9][0-9] [A-Za-z0-9]");
	if(regExpr1.test(str) 
		|| regExpr2.test(str) 
			|| regExpr3.test(str)
				|| regExpr4.test(str)
					|| regExpr5.test(str)){
		return true;
	}
	return false;
}

function isMenuLevel2(p_str){
	var str = p_str.substring(0,10);
	var regExpr1 = new RegExp("^[0-9]\.[0-9]\.[0-9] [A-Za-z0-9]");
	var regExpr2 = new RegExp("^[0-9]\.[0-9]\.[0-9][0-9] [A-Za-z0-9]");
	var regExpr3 = new RegExp("^[0-9]\.[0-9][0-9]\.[0-9][0-9] [A-Za-z0-9]");
	var regExpr4 = new RegExp("^[0-9][0-9]\.[0-9]\.[0-9] [A-Za-z0-9]");
	var regExpr5 = new RegExp("^[0-9][0-9]\.[0-9]\.[0-9][0-9] [A-Za-z0-9]");
	var regExpr6 = new RegExp("^[0-9][0-9]\.[0-9][0-9]\.[0-9] [A-Za-z0-9]");
	var regExpr7 = new RegExp("^[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9] [A-Za-z0-9]");
	
	if(regExpr1.test(str) 
		|| regExpr2.test(str) 
			|| regExpr3.test(str)
				|| regExpr3.test(str)
					|| regExpr4.test(str)
						|| regExpr5.test(str)
							|| regExpr6.test(str)
								|| regExpr7.test(str)){
		return true;
	}
	return false;	
}

function getListMenuToSummary(){
	var html 		        = "";
	var rs 			        = null;
	var sql 		        = "";
    var idMenu              = "";
	var idMenuPai           = "";
	var titleMenu           = "";
	var arrIdMenuLevel0    = new Array();
	var arrIdMenuPaiLevel0 = new Array();
	var arrTitleMenuLevel0 = new Array();
	var arrIdMenuLevel1    = new Array();
	var arrIdMenuPaiLevel1 = new Array();
	var arrTitleMenuLevel1 = new Array();
	var arrIdMenuPaiLevel2 = new Array();
	var arrTitleMenuLevel2 = new Array();
	openDbConnection();
	rs = new ActiveXObject("ADODB.Recordset");
    sql =  "SELECT MN1.MN_ID, MN1.MN_PAI, MN1.MN_TITLE ";
	sql += "FROM MENU_02 MN1 ";
	sql += "LEFT OUTER JOIN MENU_02 MN2 ON MN1.MN_ID = MN2.MN_PAI ";
	sql += "WHERE MN1.MN_STATUS = 1 ";
	sql += "GROUP BY MN1.MN_ID";
	try{
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
	}catch(err){
		alert(err.description);
	}	
    if(!rs.bof){
      rs.MoveFirst();
      while(!rs.eof){
		idMenu    = rs.fields(0).value;
		idMenuPai = rs.fields(1).value;
		titleMenu = rs.fields(2).value;
		if(isMenuLevel0(titleMenu)){
			arrIdMenuLevel0.push(idMenu);
			arrIdMenuPaiLevel0.push(idMenuPai);
			arrTitleMenuLevel0.push(titleMenu);
		}else if(isMenuLevel1(titleMenu)){
			arrIdMenuLevel1.push(idMenu);
			arrIdMenuPaiLevel1.push(idMenuPai);
			arrTitleMenuLevel1.push(titleMenu);
		}else if(isMenuLevel2(titleMenu)){
			arrIdMenuPaiLevel2.push(idMenuPai);
			arrTitleMenuLevel2.push(titleMenu);
		}
		idMenu    = "";
		idMenuPai = "";
		titleMenu = "";
		rs.MoveNext();
	  }	  
    }	
    rs.close();
	closeDbConnection();
	exportHTMLFile(arrIdMenuLevel0, arrIdMenuPaiLevel0, arrTitleMenuLevel0, arrIdMenuLevel1, arrIdMenuPaiLevel1, arrTitleMenuLevel1, arrIdMenuPaiLevel2, arrTitleMenuLevel2);
}

function exportHTMLFile(p_arrIdMenuLevel0, p_arrIdMenuPaiLevel0, p_arrTitleMenuLevel0, p_arrIdMenuLevel1, p_arrIdMenuPaiLevel1, p_arrTitleMenuLevel1, p_arrIdMenuPaiLevel2, p_arrTitleMenuLevel2){
	var arrIdMenuLevel0    = p_arrIdMenuLevel0;
	var arrIdMenuPaiLevel0 = p_arrIdMenuPaiLevel0;
	var arrTitleMenuLevel0 = p_arrTitleMenuLevel0;
	var arrIdMenuLevel1    = p_arrIdMenuLevel1;
	var arrIdMenuPaiLevel1 = p_arrIdMenuPaiLevel1;
	var arrTitleMenuLevel1 = p_arrTitleMenuLevel1;
	var arrIdMenuPaiLevel2 = p_arrIdMenuPaiLevel2;
	var arrTitleMenuLevel2 = p_arrTitleMenuLevel2;
	var idMenuLevel0        = "";
	var idMenuPaiLevel0     = "";
	var titleMenuLevel0     = "";
	var fileNameMenuLevel0  = "";
	var idMenuLevel1        = "";
	var titleMenuLevel1     = "";
	var fileNameMenuLevel1  = "";
	var titleMenuLevel2     = "";
	var fileNameMenuLevel2  = "";
	var html   				= "";
	var file 				= "";
	var fh 					= "";
	var fso  				= null;
    
	html += "<html xmlns='http://www.w3.org/1999/xhtml' dir='ltr' lang='pt-BR'>\n";
	html +=	"<head>\n";
	html += "	<meta http-equiv='Content-Type' content='text/html; charset=ISO-8859-1' />\n";
	html += "	<title>Vilson Trevisan Consultoria - Manual de Orienta&ccedil&atilde;o para Controle de Custos</title>\n";
	html +=	"	<link rel='stylesheet' href='css/style.css' type='text/css' media='Screen'>\n";		
	html += "</head>\n";
	html += "<body>\n";
	html += 	"<div id='main'>\n";			
	html += 		"<div id='header'></div>\n";			
	html += 		"<div class='menu'>\n";
	html += 			"<ul>\n";
	html += 				"<li><div></div></li>\n";
	html += 				"<li>\n";
	html += 					"<ul>\n";
	html += 						"<li><a href='home.htm'><img src='images/buttonInicio.gif' height='26px' width='100px' border='0' onmouseover=this.src='images/buttonInicioOver.gif'; onmouseout=this.src='images/buttonInicio.gif'; /></a></li>\n";
	html += 						"<li><a href='index.htm'><img src='images/buttonIndice.gif' height='26px' width='100px' border='0' onmouseover=this.src='images/buttonIndiceOver.gif'; onmouseout=this.src='images/buttonIndice.gif'; /></a></li>\n";
	html += 						"<li><img src='images/buttonAnteriorDisabled.gif' height='26px' width='100px' border='0' /></li>\n";
	html += 						"<li><a href='1_Introducao.htm'><img src='images/buttonProximo.gif' height='26px' width='100px' border='0' onmouseover=this.src='images/buttonProximoOver.gif'; onmouseout=this.src='images/buttonProximo.gif'; /></a></li>\n";
	html += 						"</ul>\n";				
	html += 				"</li>\n";
	html += 			"</ul>\n";
	html += 		"</div>\n";			
	html += 		"<div id='page'>\n";				
	html += 			"<div class='page-top'></div>\n";					
	html += 				"<div class='page'>\n";						
	html += 					"<h1>Índice</h1>\n";
	html += 					"<div class='index'>\n";							
	html += 						"<div class='border-index'>\n";						
	html += 							"<div class='border-index-top-left'></div>\n";
	html += 							"<div class='border-index-top-right'></div>\n";
	html += 							"<div class='border-index-middle'></div>\n";
	html += 							"<div class='border-index-content'>\n";								
											for(var i=0;i<arrIdMenuLevel0.length;i++){
												idMenuLevel0        = arrIdMenuLevel0[i];
												idMenuPaiLevel0     = arrIdMenuPaiLevel0[i];
												titleMenuLevel0     = arrTitleMenuLevel0[i];
												fileNameMenuLevel0  = formatNameFile(titleMenuLevel0);
												fileNameMenuLevel0 += ((isAExcelItem(fileNameMenuLevel0))?".xls":".htm");
																															
												html += "<!--Menu title-->\n";
												html += "<div class='menu-title'>\n";
												html += "	<div class='menu-title-top-left'></div>\n";
												html += "	<div class='menu-title-middle'><a href='" + fileNameMenuLevel0 + "'>" + titleMenuLevel0 + "</a></div>\n";
												html += "	<div class='menu-title-top-right'></div>\n";
																																	
												for(var j=0;j<arrIdMenuLevel1.length;j++){
													idMenuPaiLevel1 = arrIdMenuPaiLevel1[j];
													if(idMenuPaiLevel1 == idMenuLevel0){															
														idMenuLevel1       = arrIdMenuLevel1[j];
														titleMenuLevel1    = arrTitleMenuLevel1[j];
														fileNameMenuLevel1 = formatNameFile(titleMenuLevel1);
														fileNameMenuLevel1 += ((isAExcelItem(fileNameMenuLevel1))?".xls":".htm");
														
														html += "		<!--Menu item-->\n";
														html += "		<div class='menu-item'><a href='" + fileNameMenuLevel1 + "'>" + titleMenuLevel1 + "</a></div>\n";															
																									
														for(var k=0;k<arrTitleMenuLevel2.length;k++){
															idMenuPaiLevel2 = arrIdMenuPaiLevel2[k];
															if(idMenuPaiLevel2 == idMenuLevel1){
																idMenuPaiLevel2    = arrIdMenuPaiLevel2[k];
																titleMenuLevel2    = arrTitleMenuLevel2[k];
																fileNameMenuLevel2 = formatNameFile(titleMenuLevel2);
																fileNameMenuLevel2 += ((isAExcelItem(fileNameMenuLevel2))?".xls":".htm");
																html += "		<!--Menu sub item-->\n";
																html += "		<div class='menu-sub-item'><a href='" + fileNameMenuLevel2 + "'>" + titleMenuLevel2 + "</a></div>\n";
																titleMenuLevel2    = "";
																fileNameMenuLevel2 = "";																								
															}															
														}
														idMenuLevel1       = ""; 
														titleMenuLevel1    = "";
														fileNameMenuLevel1 = "";												
															
													}else{
														continue;
													}													
												}												
												idMenuLevel0       = ""; 
												titleMenuLevel0    = "";
												fileNameMenuLevel0 = "";
												html +=	"</div>\n";									
											}	
	html += 							"</div>\n";						
	html += 							"<div class='border-index-middle'></div>\n";
	html += 							"<div class='border-index-bottom-right'></div>\n";								
	html += 							"<div class='border-index-bottom-left'></div>\n";																
	html += 						"</div>\n";								
	html += 					"</div>\n";							
	html += 				"</div>\n";					
	html += 				"<div class='page-bottom'></div>\n";				
	html += 		"</div>\n";			
	html += 		"<div id='#footer'>\n";
	html += 			"<p class='copyright'>\n";
	html += 				"Vilson Trevisan Consultoria &copy 2009. Todos os direitos reservados. Este site é melhor visualizado em Internet Explorer 8.";
	html += 			"</p>\n";	
	html += 		"</div>\n";		
	html += 	"</div>\n";		
	html += "</body>\n";	
	html += "</html>\n";
	
	try{
		fso  = new ActiveXObject("Scripting.FileSystemObject"); 
		file = PATH_CONTENT_FILES + "index.htm";
		fh   = fso.CreateTextFile(file, true); 
		fh.WriteLine(html); 
		fh.Close();
		alert("Arquivo HTML exportado com sucesso.");
	}catch(err){
		alert(err.description);
	}		
}

function getListMenu(p_startPage){
	var html            = "";
	var rs              = null;
	var rs2             = null;
	var rs3             = null;
	var sql             = "";
	var sql2            = "";
	var sql3            = "";
	var idMenu0         = "";
	var idMenu1         = "";
	var idMenu2         = "";
	var titleMenu       = "";
	var titleMenuPai    = "";
	var statusMenu      = "";	
	var arrIdMenu       = null;
	var arrHtml         = null;
	var startPagination = parseInt(p_startPage);
	var endPagination   = startPagination + PAGE_SIZE - 1;
	var isFirst0        = false;
	openDbConnection();
	sql =  "SELECT MN_ID "
	sql += "FROM MENU_02 ";
	sql += "WHERE MN_PAI IS NULL "
	sql += "ORDER BY MN_ID";
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
			arrHtml = new Array();
			for(var i=0;i<arrIdMenu.length;i++){			
				idMenu0 = arrIdMenu[i];				
				sql2 =  "SELECT MN1.MN_ID, MN1.MN_TITLE, IFNULL(MN2.MN_TITLE,'') AS MN_PAI, MN1.MN_STATUS ";
				sql2 += "FROM MENU_02 MN1 ";
				sql2 += "LEFT OUTER JOIN MENU_02 MN2 ON MN1.MN_PAI = MN2.MN_ID ";
				sql2 += "WHERE MN1.MN_ID = " + idMenu0 + " OR MN1.MN_PAI = " + idMenu0 + " ";
				sql2 += "ORDER BY MN1.MN_ID";
				rs2 = new ActiveXObject("ADODB.Recordset");
				rs2.open(sql2, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
				if(!rs2.bof){				  
					rs2.MoveFirst();
					isFirst0 = true;
					while(!rs2.eof){
						idMenu1      = rs2.fields(0).value;
						titleMenu    = rs2.fields(1).value;
						titleMenuPai = rs2.fields(2).value;
						statusMenu   = rs2.fields(3).value;						
						if(isFirst0){
							html = getHTMLMenu(idMenu1, titleMenu, titleMenuPai, statusMenu);
							arrHtml.push(html);
							html = "";
							isFirst0 = false;
						}else if(idMenu0 != idMenu1){
							html = getHTMLMenu(idMenu1, titleMenu, titleMenuPai, statusMenu);
							arrHtml.push(html);
							html = "";
							sql3 =  "SELECT MN1.MN_ID, MN1.MN_TITLE, IFNULL(MN2.MN_TITLE,'') AS MN_PAI, MN1.MN_STATUS ";
							sql3 += "FROM MENU_02 MN1 ";
							sql3 += "LEFT OUTER JOIN MENU_02 MN2 ON MN1.MN_PAI = MN2.MN_ID ";
							sql3 += "WHERE MN1.MN_ID = " + idMenu1 + " OR MN1.MN_PAI = " + idMenu1 + " ";
							sql3 += "ORDER BY MN1.MN_ID";
							rs3 = new ActiveXObject("ADODB.Recordset");
							rs3.open(sql3, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
							if(!rs3.bof){				  
								rs3.MoveFirst();
								while(!rs3.eof){
									idMenu2      = rs3.fields(0).value;
									titleMenu    = rs3.fields(1).value;
									titleMenuPai = rs3.fields(2).value;
									statusMenu   = rs3.fields(3).value;						
									if(idMenu1 != idMenu2){
										html = getHTMLMenu(idMenu2, titleMenu, titleMenuPai, statusMenu);
										arrHtml.push(html);
										html = "";
									}									
									rs3.MoveNext();
								}
							}
						}						
						rs2.MoveNext();			
					}					
				}				
			}		
			
			if(arrHtml != null && arrHtml.length > 0){
				for(var i=startPagination;i<=endPagination;i++){
					if(arrHtml[i] != undefined){
						html += arrHtml[i];
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

function getHTMLMenu(p_idMenu, p_titleMenu, p_titleMenuPai, p_statusMenu){
	var html = "";
	html = "<tr valign='top'>\n";
	html += "	<th scope='row' class='check-column'>\n";
	html += "		<input type='checkbox' value='" + p_idMenu + "' />\n";
	html +=	"	</th>\n";
	html +=	"	<td class='post-title column-title'><a class='row-title' href='detailMenu.htm?idMenu=" + p_idMenu + "&sessionId=" + getSessionId() + "'>" + p_titleMenu + "</a></td>\n";
	html += "	<td class='author column-author'><a href='detailMenu.htm?idMenu=" + p_idMenu + "&sessionId=" + getSessionId() + "'>" + p_titleMenuPai + "</a></td>\n";
	html +=	"	<td class='tags column-tags'>" + ((p_statusMenu == "1") ? 'Ativo':'Inativo') + "</td>\n";
	html += "</tr>\n";
	return html;
}

function getMenuById(p_id){
	var rs 		   = null;
	var sql 	   = "";
    var idMenu     = "";
	var idMenuPai  = "";
	var titleMenu  = "";
	var statusMenu = false;
	openDbConnection();	
	rs = new ActiveXObject("ADODB.Recordset");
    sql = "SELECT MN_ID, MN_PAI, MN_TITLE, MN_STATUS FROM MENU_02 WHERE MN_ID = " + p_id;
	try{
		rs.open(sql, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
	}catch(err){
		alert(err.description);
	}	
	if(!rs.bof) {
      rs.moveFirst();
	  idMenu     = rs.fields(0).value;
	  idMenuPai  = rs.fields(1).value;
	  titleMenu  = rs.fields(2).value;
	  statusMenu = ((rs.fields(3).value == "1") ? true : false);
	  loadFieldsMenu(idMenu, idMenuPai, titleMenu, statusMenu);
    }
    rs.close();
	closeDbConnection();    
}

function loadFieldsMenu(p_idMenu, p_idMenuPai, p_titleMenu, p_statusMenu){
	document.getElementById("menu-id").value = p_idMenu;
	document.getElementById("menu-title").value = p_titleMenu;
	setMenuPai(p_idMenuPai);
	document.getElementById("menu-status").checked = p_statusMenu;			
}

function loadDataMenu(){
	var idMenu = querySt("idMenu");
	getMenuById(idMenu);
}

function getSelectMenu(){
	var html            = "";
	var rs              = null;
	var rs2             = null;
	var sql             = "";
	var sql2            = "";
	var idMenu          = "";
	var idMenu0         = "";
	var idMenu1         = "";
	var titleMenu       = "";
	var statusMenu      = "";	
	var arrIdMenu       = null;
	var arrMenu         = null;
	var arrData         = null;
	var isFirst0        = false;
	openDbConnection();
	sql =  "SELECT MN_ID "
	sql += "FROM MENU_02 ";
	sql += "WHERE MN_PAI IS NULL "
	sql += "ORDER BY MN_ID";
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
			arrData = new Array();
			for(var i=0;i<arrIdMenu.length;i++){			
				idMenu0 = arrIdMenu[i];				
				sql2 =  "SELECT MN1.MN_ID, MN1.MN_TITLE, IFNULL(MN2.MN_TITLE,'') AS MN_PAI, MN1.MN_STATUS ";
				sql2 += "FROM MENU_02 MN1 ";
				sql2 += "LEFT OUTER JOIN MENU_02 MN2 ON MN1.MN_PAI = MN2.MN_ID ";
				sql2 += "WHERE MN1.MN_ID = " + idMenu0 + " OR MN1.MN_PAI = " + idMenu0 + " ";
				sql2 += "ORDER BY MN1.MN_ID";
				rs2 = new ActiveXObject("ADODB.Recordset");
				rs2.open(sql2, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
				if(!rs2.bof){				  
					rs2.MoveFirst();
					isFirst0 = true;					
					while(!rs2.eof){
						idMenu1      = rs2.fields(0).value;
						titleMenu    = rs2.fields(1).value;
						titleMenuPai = rs2.fields(2).value;
						statusMenu   = rs2.fields(3).value;						
						if((isFirst0) || (idMenu0 != idMenu1)){
							arrMenu = new Array();
							arrMenu[0] = idMenu1;
							arrMenu[1] = titleMenu;
							arrData.push(arrMenu);
							isFirst0 = false;
						}						
						rs2.MoveNext();			
					}					
				}				
			}			
		}
		if(arrData != null && arrData.length > 0){
			html =  "<select id='select-menu-pai' class='postform'>\n";
			html += "<option value='-1'>Nenhum</option>\n";
			for(var i=0;i<=arrData.length;i++){
				arrMenu   = arrData[i];
				if(arrMenu != null){
					idMenu    = arrMenu[0];
					titleMenu = arrMenu[1];
					html += "<option value='" + idMenu + "'>" + titleMenu + "</option>\n";				
				}				
			}
			html += "</select>\n";
			document.write(html);
		}
	}catch(err){
		alert(err.description);
	}	
    rs2.close();
	rs.close();
	closeDbConnection();
}

function getRadiosMenu(){
	var html            = "";
	var rs              = null;
	var rs2             = null;
	var rs3             = null;
	var sql             = "";
	var sql2            = "";
	var sql3            = "";
	var idMenu0         = "";
	var idMenu1         = "";
	var idMenu2         = "";
	var titleMenu       = "";
	var titleMenuPai    = "";
	var statusMenu      = "";	
	var arrIdMenu       = null;
	var arrHtml         = null;
	var isFirst0        = false;
	openDbConnection();
	sql =  "SELECT MN_ID "
	sql += "FROM MENU_02 ";
	sql += "WHERE MN_PAI IS NULL "
	sql += "ORDER BY MN_ID";
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
			arrHtml = new Array();
			for(var i=0;i<arrIdMenu.length;i++){			
				idMenu0 = arrIdMenu[i];				
				sql2 =  "SELECT MN1.MN_ID, MN1.MN_TITLE, IFNULL(MN2.MN_TITLE,'') AS MN_PAI, MN1.MN_STATUS ";
				sql2 += "FROM MENU_02 MN1 ";
				sql2 += "LEFT OUTER JOIN MENU_02 MN2 ON MN1.MN_PAI = MN2.MN_ID ";
				sql2 += "WHERE (MN1.MN_ID = " + idMenu0 + " OR MN1.MN_PAI = " + idMenu0 + ") AND MN1.MN_STATUS = 1 ";
				sql2 += "ORDER BY MN1.MN_ID";
				rs2 = new ActiveXObject("ADODB.Recordset");
				rs2.open(sql2, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
				if(!rs2.bof){				  
					rs2.MoveFirst();
					isFirst0 = true;
					while(!rs2.eof){
						idMenu1      = rs2.fields(0).value;
						titleMenu    = rs2.fields(1).value;
						titleMenuPai = rs2.fields(2).value;
						statusMenu   = rs2.fields(3).value;						
						if(isFirst0){
							html = getHTMLRadiosMenu(idMenu1, titleMenu);
							arrHtml.push(html);
							html = "";
							isFirst0 = false;
						}else if(idMenu0 != idMenu1){
							html = getHTMLRadiosMenu(idMenu1, titleMenu);
							arrHtml.push(html);
							html = "";
							sql3 =  "SELECT MN1.MN_ID, MN1.MN_TITLE, IFNULL(MN2.MN_TITLE,'') AS MN_PAI, MN1.MN_STATUS ";
							sql3 += "FROM MENU_02 MN1 ";
							sql3 += "LEFT OUTER JOIN MENU_02 MN2 ON MN1.MN_PAI = MN2.MN_ID ";
							sql3 += "WHERE (MN1.MN_ID = " + idMenu1 + " OR MN1.MN_PAI = " + idMenu1 + ") AND MN1.MN_STATUS = 1 ";
							sql3 += "ORDER BY MN1.MN_ID";
							rs3 = new ActiveXObject("ADODB.Recordset");
							rs3.open(sql3, connection, AD_OPEN_DYNAMIC, AD_LOCK_OPTIMISTIC);
							if(!rs3.bof){				  
								rs3.MoveFirst();
								while(!rs3.eof){
									idMenu2      = rs3.fields(0).value;
									titleMenu    = rs3.fields(1).value;
									titleMenuPai = rs3.fields(2).value;
									statusMenu   = rs3.fields(3).value;						
									if(idMenu1 != idMenu2){
										html = getHTMLRadiosMenu(idMenu2, titleMenu);
										arrHtml.push(html);
										html = "";
									}									
									rs3.MoveNext();
								}
							}
						}						
						rs2.MoveNext();			
					}					
				}				
			}		
			
			if(arrHtml != null && arrHtml.length > 0){
				for(var i=0;i<=arrHtml.length;i++){
					if(arrHtml[i] != undefined){
						html += arrHtml[i];
					}					
				}
				document.write(html);
			}			
		}			
	}catch(err){
		alert(err.description);
	}    
	rs2.close();
	rs.close();
	closeDbConnection();  
}

function getHTMLRadiosMenu(p_idMenu, p_titleMenu){
	var html = "";
	html = "<li class='popular-category'><label class='selectit'><input id='menu-id' name='menu-id' value='" + p_idMenu + "' type='radio' onClick='updateFieldTitle()' /> <span>" + p_titleMenu + "</span></label></li>\n";
	return html;
}

function updateMenu(p_id){
    var id         = p_id;
	var sql        = "";
	var msg        = "";
    var menuTitle  = document.getElementById("menu-title").value;
	var menuPai    = document.getElementById("select-menu-pai").value;
	menuPai        = (menuPai == -1) ? "NULL" : menuPai;
	var menuStatus = ((document.getElementById("menu-status").checked) ? 1 : 0);
	openDbConnection();	
	if(id != ""){
		//Sql used to double check if already exists a record for the given id
		sql = "SELECT COUNT(*) AS COUNT FROM MENU_02 WHERE MN_ID = " + id;
		//If the record already exists, it will be updated into database
		if(existsRecord(sql)){
			sql = "";
			sql = "UPDATE MENU_02 SET MN_TITLE = '" + menuTitle + "', MN_PAI = " + menuPai + ", MN_STATUS = " + menuStatus + " WHERE MN_ID = " + id;
			msg = "Registro atualizado com sucesso.";
		}		
	} else { //Otherwise, a new record will be inserted into database
		sql = "";
		sql = "INSERT INTO MENU_02(MN_TITLE, MN_PAI, MN_STATUS) VALUES ('" + menuTitle + "', " + menuPai + "," + menuStatus + ")";
		msg = "Registro adicionado com sucesso.";
	}	
	try{
		connection.execute(sql);
		alert(msg);		
	}catch(err){
		alert(err.description);
	}
	closeDbConnection();	
}

function isAvailableMenu(p_pageId, p_menuId){
	var sql = "";
	if(p_pageId != ""){
		sql = "SELECT COUNT(*) AS COUNT FROM PAGE_03 WHERE PG_ID != " + p_pageId + " AND MN_ID = " + p_menuId;
	}else{
		sql = "SELECT COUNT(*) AS COUNT FROM PAGE_03 WHERE MN_ID = " + p_menuId;
	}	
	if(existsRecord(sql)){
		alert("Este Menu já esta associado a outra Pagina. Por favor, selecione outro Menu.");
		return false;
	}else{
		return true;
	}	
}

function deleteGroupMenus(){
	var sql = "DELETE FROM MENU_02 WHERE MN_ID = ";
	deleteGroupMenu(sql);	
}

function deleteGroupMenu(){
	var inputs  = document.getElementsByTagName("input");
	var input   = null;
	var success = false;
	openDbConnection();
	for(var i=0;i<inputs.length; i++){
		input = inputs[i];
		if(input.type == "checkbox"){
			var checkBox = input;
			if(checkBox.checked){
				if(checkBox.id != "checkbox-header" 
					&& checkBox.id != "checkbox-footer"){
					var id = checkBox.value;
					success = deleteMenu2(id);					
				}					
			}
		}
	}
	closeDbConnection();
	if(success){
		alert("Registro(s) excluído(s) com sucesso.");
	}
}

function deleteMenu(p_id){
	var sql = "DELETE FROM MENU_02 WHERE MN_ID = " + p_id;
	openDbConnection();
	try{
		sql = "SELECT COUNT(*) AS COUNT FROM PAGE_03 WHERE MN_ID = " + p_id;
		if(!existsRecord(sql)){
			sql = "DELETE FROM MENU_02 WHERE MN_ID = " + p_id;
			deleteRecord(sql);
		} else{
			alert("Este Menu está associado a uma Página e não pode ser excluído. Para excluí-lo, exclua primeiro a página associada a ele.");
			return false;
		}		
	}catch(err){
		alert(err.description);
		return false;
	}	
	alert("Registro excluido com sucesso.");
	closeDbConnection();
	return true;
}

function deleteMenu2(p_id){
	var sql = "DELETE FROM MENU_02 WHERE MN_ID = " + p_id;
	openDbConnection();
	try{
		sql = "SELECT COUNT(*) AS COUNT FROM PAGE_03 WHERE MN_ID = " + p_id;
		if(!existsRecord(sql)){
			sql = "DELETE FROM MENU_02 WHERE MN_ID = " + p_id;
			deleteRecord(sql);
		} else{
			alert("Este Menu está associado a uma Página e não pode ser excluído. Para excluí-lo, exclua primeiro a página associada a ele.");
			return false;
		}		
	}catch(err){
		alert(err.description);
		return false;
	}	
	closeDbConnection();
	return true;
}

function getMenuId(){
	var menuId = "";
	var inputs = document.getElementsByTagName("input");
	var input = null;
	for (var i=0;i<inputs.length; i++){
		input = inputs[i];
		if(input.type == "radio" && input.checked)					
			menuId = input.value;
	}
	return menuId;
}

function getSelectedMenu(){
	var inputs = document.getElementsByTagName("input");
	var input = null;
	for (var i=0;i<inputs.length; i++){
		input = inputs[i];
		if(input.type == "radio" && input.checked)					
			return input;
	}
	return input;	
}

function setMenuPai(p_idMenuPai){
	var selectMenuPai = document.getElementById("select-menu-pai");
	if(p_idMenuPai != null){
		for(var i=0; i<selectMenuPai.options.length; i++){
			if(selectMenuPai.options[i].value == p_idMenuPai) {
				selectMenuPai.options[i].selected = true;
			}
		}
	} else {
		selectMenuPai.options[0].selected = true;
	}
}

function setMenuId(p_menuId){
	var inputs = document.getElementsByTagName("input");
	var input = null;
	for (var i=0;i<inputs.length; i++){
		input = inputs[i];
		if(input.type == "radio" && input.value == p_menuId)					
			input.checked = true;
	}	
}

function processMenu(){
	var action = document.getElementById("action");
	if(action.options[action.selectedIndex].value == "delete"){
		deleteGroupMenus();
	}
}

function configPaginationMenu(){
	var data = null;
	var sql  = "SELECT COUNT(*) AS TOTAL FROM MENU_02";
	data     = getDataPagination(sql);
	return data;
}

function configFooterPagination(p_totalPages, p_page){
	var totalPages = p_totalPages;
	var page       = p_page;
	var html       = "";
	if(totalPages > 1){
		if(page > 1){
			html += "<th scope='col' class='manage-column'><a href='listMenu.htm?page=1&sessionId=" + getSessionId() + "'><img src='images/arrow_first.gif' /></a></th>\n";
			html += "<th scope='col' class='manage-column'><a href='listMenu.htm?page=" + (page - 1) + "&sessionId=" + getSessionId() + "'><img src='images/arrow_previous.gif' /></a></th>\n";
		}
		if(page < totalPages){
			html += "<th scope='col' class='manage-column'><a href='listMenu.htm?page=" + (page + 1) + "&sessionId=" + getSessionId() + "'><img src='images/arrow_next.gif' /></a></th>\n";
			html += "<th scope='col' class='manage-column'><a href='listMenu.htm?page=" + totalPages + "&sessionId=" + getSessionId() + "'><img src='images/arrow_last.gif' /></a></th>\n";
		}												
	}
	document.write(html);
}
