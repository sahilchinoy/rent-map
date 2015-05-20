var map = L.map('map').setView([37.862882, -122.254616], 14);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
    detectRetina: true,
}).addTo(map);



Parse.initialize("sE7D0GSTTE34WwliYKhme6b2Xo2aINTcgSVdgO4E", "7EhupRm9X7M1G9Grqk3cEzbMm7EpJgZzDcbIxMUP");
var Residence = Parse.Object.extend("Residence");

var generateMarkers = function(residences) {

	var markers = new Array();

	for (var i=0; i < residences.length; i++) {

		var data = new Array();

		data.rent = residences[i].attributes.rent;
		data.lat = residences[i].attributes.coords.latitude;
		data.lng = residences[i].attributes.coords.longitude;
		data.occupancy = residences[i].attributes.occupancy;

		formattedAddress = String(residences[i].attributes.formattedAddress);
		data.address = formattedAddress.split(',')[0];

		markers[i] = L.marker([data.lat, data.lng])
			.addTo(map)
			.bindPopup(popupText(data));
	}
}

var popupText = function(data) {
	return '<b>' + String(data.address) + '</b> <br /> $' + String(data.rent) + '/month <br />' + String(data.occupancy);
}

var getResidences = function() {
	var query = new Parse.Query(Residence);
	query.find({
	  success: function(results) {
	    generateMarkers(results);
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

getResidences();
