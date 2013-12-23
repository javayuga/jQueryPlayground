$('document').ready(

$.getJSON('getip.php', function(data){
	$('#yourIP').html(data.ip);
	
})

);