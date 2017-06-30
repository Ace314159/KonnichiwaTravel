$(document).ready(function() {
	var request = "http://api.openweathermap.org/data/2.5/forecast?q=Hyderabad,IN&mode=xml&appid=15833ee3b7665068e0cc18a3e13837b4";
	$.getJSON(request, function(data) {
		alert(1);
		document.write(JSON.stringify(data));
		console.log(data);
	}).done(function(data) {
		alert(1);
	});
})
;