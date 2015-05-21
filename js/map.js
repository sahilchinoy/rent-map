
var mapOptions = {
  zoom: 15,
  center: new google.maps.LatLng(37.864649, -122.261203),
  mapTypeId: google.maps.MapTypeId.ROAD
};
var map = new google.maps.Map(document.getElementById("map"),
    mapOptions);


var colors = ['rgb(255,237,160)','rgb(254,178,76)','rgb(240,59,32)'];

var colorScale = function(rent) {
	if (rent > 0 && rent < 600) {
		return colors[0];
	} else if (rent >= 600 && rent < 900) {
		return colors[1];
	} else {
		return colors[2];
	}
}

Parse.initialize("sE7D0GSTTE34WwliYKhme6b2Xo2aINTcgSVdgO4E", "7EhupRm9X7M1G9Grqk3cEzbMm7EpJgZzDcbIxMUP");
var Residence = Parse.Object.extend("Residence");

var generateMarkers = function(residences) {

	var markers = new Array();
	var info = new google.maps.InfoWindow({
		content: ''
	});

	for (var i=0; i < residences.length; i++) {
		
		var data = new Array();

		data.rent = residences[i].attributes.rent;
		data.lat = residences[i].attributes.coords.latitude;
		data.lng = residences[i].attributes.coords.longitude;
		data.occupancy = residences[i].attributes.occupancy;

		formattedAddress = String(residences[i].attributes.formattedAddress);
		data.address = formattedAddress.split(',')[0];

		var center = new google.maps.LatLng(data.lat,data.lng);

		markers[i] = new google.maps.Marker({
			position: center,
			map: map,
			title: data.address,
			html: popupText(data)
		});

		google.maps.event.addListener(markers[i], 'click', function() {
			info.setContent(this.html);
			info.open(map, this);
		});

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
