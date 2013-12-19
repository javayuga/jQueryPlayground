$.imgResource = {
	resolverUri : "",
	baseUrl : "http://188.21.14.209:8080/BasicTfhGwtBridge/stream?",
	accessId : "custom.ruvModel",
	sessionId : ""	
}

$.tfhConstants = {
	version : "0.0.1",
	baseUrl : "http://188.21.14.209:8080/TfhGmeRestlet/",
	localUrl : "localhost/jquery/samples/nvu/json/",
	local : false,
	sessionId : "",
	defaultUser : "cortex",
	defaultPassword : "cortex"
};

function pointToLocalHost(){
if ($.tfhConstants.local){
   $.tfhConstants.baseUrl = $.tfhConstants.localUrl;
  }
}

$.authenticateParams = {
	user : $.tfhConstants.defaultUser,
	password : $.tfhConstants.defaultPassword
};

$.retrieveVorgangParams = {
	entityType : "com.braintribe.model.ruv.Vorgang",
	accessKind : "query",
	accessId : "custom.ruvModel",
	sessionId : ""
};

$.deleteVorgangParams = {
		entityType : "com.braintribe.model.ruv.Vorgang",
		accessKind : "delete",
		accessId : "custom.ruvModel",
		sessionId : "",
		selectedVorgangKey : ""
	};


$.indexedDB("NVU", {
	"version" : 17,
	"schema" : {
		1 : function(v) {
			var objectStore = v.createObjectStore("Vorgang", {
				"keyPath" : "_id",
				"autoIncrement" : false
			});
			objectStore.createIndex("price");
			console.info("Created new object store");
		}
	}
}).then(console.info, console.error);


$.indexedDB("NVU").objectStore("Vorgang", false).clear();

function retrieveSessionId() {
    var authenticateUrl;
	
    if ($.tfhConstants.local){
	   authenticateUrl=$.tfhConstants.localUrl + 'authenticate.json';
	}else{
	   authenticateUrl=$.tfhConstants.baseUrl + 'authenticate?' + $.param($.authenticateParams);
	}

	$.ajax({
		url : authenticateUrl, 
		dataType : 'json',
		success : function(data) {
			$.tfhConstants.sessionId = data.sessionId;
			$.imgResource.sessionId = data.sessionId;
			updateViewSessionId();

			retrieveAllVorgang();
		},
		statusCode : {
			404 : function() {
				alert('There was a problem with the server.  Try again soon!');
			}
		}
	});

};

function updateViewSessionId() {
	$("#sessionId").html($.tfhConstants.sessionId);
	$("#entityLoads").show();
};

function retrieveAllVorgang() {

	$.retrieveVorgangParams.sessionId = $.tfhConstants.sessionId;

	$.ajax({
		url : $.tfhConstants.baseUrl + 'entity?'
				+ $.param($.retrieveVorgangParams),
		dataType : 'json',
		success : function(json) {

			for (vorgang in json) {
				console.log(json[vorgang]);
				$.indexedDB("NVU").objectStore("Vorgang", true).add(
						json[vorgang]).done(function(val) {
					console.info(val);
				}, console.error);

			}

			updateViewVorgang();

		},
		statusCode : {
			404 : function() {
				alert('There was a problem with the server.  Try again soon!');
			}
		}
	});

};


function updateViewVorgang() {
	//$("#tableVorgang").empty();

	$.indexedDB("NVU").objectStore("Vorgang", false).count().then(
			function(val) {
				$("#countVorgang").html(val);

			}, console.error);
		var counter = 0;
	$.indexedDB("NVU").objectStore("Vorgang").each(function(elem){
		console.log(elem);
		$("#tableVorgang").append(
				$("<tr id = 'vRows"+counter+"'>").click(function(){
					updateViewDokumentumAndVersandeinheit(elem.key);
					}).append($('<td class = "cells">').append(elem.value.bezeichnung)));
			
		$("#vRows"+counter).append(
				$('<td>').click(function(){
					updateViewDokumentumAndVersandeinheit(elem.key);
					}).append($('<label>').append(elem.value.erstelltVon)));
		$("#vRows"+counter).append(
				$('<td>').click(function(){
					updateViewDokumentumAndVersandeinheit(elem.key);
					}).append($('<label>').append(elem.value.erstelltAm.value)));
		$("#vRows"+counter).append(
				$('<td>').click(function(){
					updateViewDokumentumAndVersandeinheit(elem.key);
					}).append($('<label>').append(elem.value.geaendertVon)));
		$("#vRows"+counter).append(
				$('<td>').click(function(){
					updateViewDokumentumAndVersandeinheit(elem.key);
					}).append($('<label>').append(elem.value.geaendertAm.value)));
		$("#vRows"+counter).append(
				$("<td>").click(function(){
					updateViewDokumentumAndVersandeinheit(elem.key);
					}).append($('<label>').append(elem.value.status)));
		counter++
	});
	
};

function updateViewDokumentumAndVersandeinheit(key){
	
	$.deleteVorgangParams.selectedVorgangKey=key;
	$('#left-pointer').bind('click', leftHiddenImg);
	$('#hidden-close').bind('click', rightHiddenImg);
	$('#vs-button').bind('click', showSmallMenu);
	$('#mv-button').bind('click', showBigMenu);
	$('#ok').bind('click', hideSmallMenu);
	$('#cancel').bind('click', hideSmallMenu);
	$('#bigOk').bind('click', hideBigMenu);
	$('#bigCancel').bind('click', hideBigMenu);
	$("#selectedVorgangKey").html(key);
	showIcons();
	$("#versanBody").empty();
	$("#dokumBody").empty();
	
	$.indexedDB("NVU").objectStore("Vorgang").get(key).then(function(item){
		var counter3 = 0;
		var counter2 = 0;
		for (vers in item.versandeinheit.value){
			$("#tableVersandeinheit").append(
					$("<tr id = 'versanRows"+counter3+"'>").append($('<td>').append(item.versandeinheit.value[vers].empfaengerDaten)));
			$("#versanRows"+counter3).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].status)));
			$("#versanRows"+counter3).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].druckziel)));
			$("#versanRows"+counter3).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].verarbeitungsDatum.value)));
			$("#versanRows"+counter3).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].rolle)));
			$("#versanRows"+counter3).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].ausfertigungen)));
					
				counter3++
			
			for (doc in item.versandeinheit.value[vers].versandDokument.value){
				$("#tableDokumentum").append(
						$("<tr id='dokumRows"+counter2+"'>").append($('<td>').append(item.versandeinheit.value[vers].versandDokument.value[doc].bezeichnung)));
				$("#dokumRows"+counter2).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].versandDokument.value[doc].erstelltVon)));
				$("#dokumRows"+counter2).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].versandDokument.value[doc].erstelltAm.value)));
				$("#dokumRows"+counter2).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].versandDokument.value[doc].geaendertVon + " / " + item.versandeinheit.value[vers].versandDokument.value[doc].geaendertAm.value)));
				$("#dokumRows"+counter2).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].versandDokument.value[doc].freigegebenVon + " / " + item.versandeinheit.value[vers].versandDokument.value[doc].freigegebenAm.value)));
				$("#dokumRows"+counter2).append(
					$('<td>').append($('<label>').append(item.versandeinheit.value[vers].versandDokument.value[doc].status)));
				$("#imgId").append(
					$('<p style="display:none">').append($('<label class="imgStream">').append(item.versandeinheit.value[0].versandDokument.value[0].doc.pages[0].representations.value[0].resourceSource.resolverURI)));
				counter2++;
				
				$.imgResource.resolverUri=item.versandeinheit.value[0].versandDokument.value[0].doc.pages[0].representations.value[0].resourceSource.resolverURI;
			}
			
		};
		
		}, console.error);
	
}

function showIcons(){
	$('#vs-button').show('drop', {}, 5);
	$('#div-mv-button').show('drop', {}, 5);
	$('#mv-button').show('drop', {}, 5);
	$('#div-xbutton2').show('drop', {}, 5);
	$('#x-button2').show('drop', {}, 5);
	$('#left-pointer').show('drop', {}, 5);
}

function showSmallMenu(){
$('#small-box-content').show('drop',{},350);
}

function showBigMenu(){
$('#big-box-content').show('drop',{},350);
}

function hideSmallMenu(){
$('#small-box-content').fadeOut(350);
}

function hideBigMenu(){
$('#big-box-content').fadeOut(350);
}

function leftHiddenImg(){
$('#hidden-block').animate({left:"760px"}, 900);
$('#hidden-close').animate({left:"748px"}, 900);
$('#hidden-expand').animate({left:"748px"}, 900);
$('#expand').animate({left:"753px"}, 900);
$('#download').animate({left:"1250"}, 900);
$('#downloadb').animate({left:"1260"}, 900);
$('#web-preview').animate({left:"1380px"}, 900);
$('#web-previewb').animate({left:"1390px"}, 900);
$('#hidden-left-pointer').animate({left:"790px"}, 900);
$('#mini-left-pointer').animate({left:"794px"}, 900);
$('#hidden-right-pointer').animate({left:"1480px"}, 900);
$('#mini-right-pointer').animate({left:"1484px"}, 900);
}

function rightHiddenImg(){
$('#hidden-block').animate({left:"1760px"}, 900);
$('#hidden-close').animate({left:"1748px"}, 900);
$('#hidden-expand').animate({left:"1748px"}, 900);
$('#expand').animate({left:"1753px"}, 900);
$('#download').animate({left:"2250"}, 900);
$('#downloadb').animate({left:"2260"}, 900);
$('#web-preview').animate({left:"2380px"}, 900);
$('#web-previewb').animate({left:"2390px"}, 900);
$('#hidden-left-pointer').animate({left:"1790px"}, 900);
$('#mini-left-pointer').animate({left:"1794px"}, 900);
$('#hidden-right-pointer').animate({left:"2480px"}, 900);
$('#mini-right-pointer').animate({left:"2484px"}, 900);
$('#shrink').animate({left:"753px"}, 900);
$('#shrink').hide('drop', {}, 5);
}


