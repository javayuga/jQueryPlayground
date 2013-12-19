$.tfhConstants = {
	version : "0.0.1",
	baseUrl : "http://188.21.14.209:8080/TfhGmeRestlet/",
	sessionId : "",
	defaultUser : "cortex",
	defaultPassword : "cortex"
};

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
	$.ajax({
		url : $.tfhConstants.baseUrl + 'authenticate?'
				+ $.param($.authenticateParams),
		dataType : 'json',
		success : function(data) {
			$.tfhConstants.sessionId = data.sessionId;
			
			
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
	$("#tableVorgang").empty();

	$.indexedDB("NVU").objectStore("Vorgang", false).count().then(
			function(val) {
				$("#countVorgang").html(val);

			}, console.error);

	$.indexedDB("NVU").objectStore("Vorgang").each(function(elem){
		console.log(elem);
		$("#tableVorgang").append(
				$('<tr>').click(function(){
					updateViewDokumentumAndVersandeinheit(elem.key);
					}).append($('<td>').append(elem.value.bezeichnung)));
	});
	
};

function updateViewDokumentumAndVersandeinheit(key){
	
	$.deleteVorgangParams.selectedVorgangKey=key;
	
	$("#selectedVorgangKey").html(key);
	
	$("#tableVersandeinheit").empty();
	$("#tableDokumentum").empty();
	
	$.indexedDB("NVU").objectStore("Vorgang").get(key).then(function(item){
		
		for (vers in item.versandeinheit.value){
			$("#tableVersandeinheit").append(
					$('<tr>').append($('<td>').append(item.versandeinheit.value[vers].empfaengerDaten)));
			
			for (doc in item.versandeinheit.value[vers].versandDokument.value){
				$("#tableDokumentum").append(
						$('<tr>').append($('<td>').append(item.versandeinheit.value[vers].versandDokument.value[doc].bezeichnung)));

			}
		};
		
		}, console.error);
	
}


