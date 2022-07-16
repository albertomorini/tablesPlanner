/**
 * Saves the configuration of the room.
 */
function saveConfig(){
	var dictTable={};
	var dictWaiters={};
	$(".room").children('div').each(function () {
		if(this.id.split("table")[0]==""){ //is a table
			dictTable[this.id]= {
				"position":	$("#"+this.id).position(),
				"name" : $("#"+this.id+"head").text(),
				"numSeats": $("#"+this.id).children("b").text()
			}
		}else{
			dictWaiters[this.id]={
				"position": $("#"+this.id).position()
			}
		}
		
	});

	//we need to serialize the dictionary, javascript's cookie are only strings
	document.cookie = "configTables="+$.param(dictTable)+";expires=Thu, 18 Dec 2053 12:00:00 UTC;SameSite=None; Secure;"; 
	document.cookie = "configWaiters="+$.param(dictWaiters)+";expires=Thu, 18 Dec 2053 12:00:00 UTC;SameSite=None; Secure;"; 
}


/**
 * change the name (not the ID) and the seats of a table
 *
 * @param      {string}  numTable  the id of the table
 */
function configTable(numTable){
	var tableName = prompt("Nome tavolo: ");
	var numSeats = prompt("Numero posti: ");

	if(tableName.length != 0){
		$("#table-"+numTable+"head").html(tableName);
	}
	if(numSeats.length != 0){
		$("#table-"+numTable).children("b").html("Posti: "+numSeats);
	}
	saveConfig()
}

/**
 * if a cookie "configTables" is created will return the configuration of the room
 *
 */
function loadExistingTables(){
	
	var config =document.cookie.split("configTables=")[1].split("configWaiters=")[0]
	if(config != null){ //if the cookie exists
		
		//get the config cookie and decode the serialized value
		var tablesProp = decodeURIComponent(config).split("&")
		//every table is made by 4 attributes: top, left, tableName, numberSeats
		// top -> [0], left[1], tableName[2], numberSeats[3]

		var strHtml=""
		for (var i=0; i<tablesProp.length; i+=4){

			var tableID = tablesProp[i].split("[")[0]
			
			//Decode the propriety of the table and add it to the html
			strHtml='<div style="top:'+tablesProp[i].split("=")[1]+'px; left:'+tablesProp[i+1].split("=")[1]+'px;" class="holder" id="'+tableID+'"><div id="'+tableID+'head" class="tableHeader" ondblclick="configTable('+tableID.split("-")[1]+')"><img class="imgDeleteTable" alt="delete" src="img/remove.png" onclick=deleteTable("'+tableID+'") />'+tablesProp[i+2].split("=")[1]+'</div><b>'+tablesProp[i+3].split("=")[1]+'</b>';


			$(".room").append(strHtml)
			dragElement(document.getElementById(tableID))
		}
	}
}

/**
 * if a cookie "configWaiters" is created will create the waiters in the room
 */
function loadExistingWaiter(){
	var config=document.cookie.split("configWaiters=")[1].split("configTables=")[0]
	if(config != null){
		var waitersProp=decodeURIComponent(config).split("&")
		//just one attribute: {top, left}

		var strHtml=""
		for (var i=0; i<waitersProp.length; i+=2){

			var waiterID= waitersProp[i].split("[")[0]

			strHtml='<div style="top:'+waitersProp[i].split("=")[1]+'px;left:'+waitersProp[i+1].split("=")[1]+'px" class="holder" id="'+waiterID+'"><div class="tableHeader" id="'+waiterID+'head"> <img class="imgDeleteTable" alt="waiter" src="img/remove.png" onclick=deleteWaiter("'+waiterID+'") /><img class="imgWaiter" src="img/waiter.png" alt="waiter"/></div>'
			$(".room").append(strHtml)
			dragElement(document.getElementById(waiterID))
		}
	}
}


//____________________________________________________________________________________
/**
 * adds a new table and make it draggable
 */
function addTable(){
	var bfrIDTable=Math.round(Math.random()*1000);
	$(".room").append('<div class="holder" id="table-'+bfrIDTable+'"><div ondblclick="configTable('+bfrIDTable+')" class="tableHeader" id="table-'+bfrIDTable+'head"> <img class="imgDeleteTable" alt="delete" src="img/remove.png" onclick=deleteTable("table-'+bfrIDTable+'") />Tavolo:'+bfrIDTable+'</div><b>Posti:</b>')
	dragElement(document.getElementById("table-"+bfrIDTable))
}
/**
 * remove an existing table
 *
 * @param      {string}  numTable  The ID of the table
 */
function deleteTable(numTable){
	$("#"+numTable).remove();
	saveConfig()
}
/**
 * remove an existing waiter
 *
 * @param      {string}  numWaiter  The id of waiter
 */
function deleteWaiter(numWaiter){
	$("#"+numWaiter).remove();
	saveConfig()
}

function addWaiter(){
	var bfrIDwaiter=Math.round(Math.random()*1000);
	$(".room").append('<div class="holder" id="waiter-'+bfrIDwaiter+'"><div class="tableHeader" id="waiter-'+bfrIDwaiter+'head"> <img class="imgDeleteTable" alt="waiter" src="img/remove.png" onclick=deleteWaiter("waiter-'+bfrIDwaiter+'") /><img class="imgWaiter" src="img/waiter.png" alt="waiter"/></div>')
	dragElement(document.getElementById("waiter-"+bfrIDwaiter))
}

/**
 * Makes an element draggable
 * 
 * @param      {<type>}  elmnt   -> the first div whose contains the inner div(where the name of the table is stored)
 * 
 * <this div we need>
 * 		<div>table #n</div>
 * 		<b> seats: </b>
 * 	</div>
 * 
 */
function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;


	if (document.getElementById(elmnt.id + "head")) {
		/* if present, the header is where you move the DIV from:*/
		document.getElementById(elmnt.id + "head").onmousedown = dragMouseDown;
	} else {
		/* otherwise, move the DIV from anywhere inside the DIV:*/
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		/* stop moving when mouse button is released:*/
		document.onmouseup = null;
		document.onmousemove = null;
	}
}



/**
 * check it there's an existing configuration.. if true will load it
 */
function init() {
	loadExistingTables()
	loadExistingWaiter()
	//TODO: if there isn't preferences, create a welcome page
}
