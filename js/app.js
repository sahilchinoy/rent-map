$(document).ready(function() {

  Parse.initialize("sE7D0GSTTE34WwliYKhme6b2Xo2aINTcgSVdgO4E", "7EhupRm9X7M1G9Grqk3cEzbMm7EpJgZzDcbIxMUP");
  var Residence = Parse.Object.extend("Residence");

  var data = {};

  function initialize() {

    //Bias autocomplete for Berkeley
    var berkBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.847182, -122.297327),
      new google.maps.LatLng(37.903279, -122.257845));

    // Create the autocomplete object, restricting the search
    // to geographical location types.
    var address = document.getElementById('address');
    autocomplete = new google.maps.places.Autocomplete(address, {
      bounds: berkBounds,
      types: ['geocode'],
      componentRestrictions: {country: 'us'}
    });

    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      fillInAddress();
    });
  }

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    console.log(place);

    data.formattedAddress = place.formatted_address;
    data.coords = new Parse.GeoPoint(place.geometry.location.A, place.geometry.location.F);

    //$('address').html = place;
  }

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = new google.maps.LatLng(
            position.coords.latitude, position.coords.longitude);
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  initialize();


  $("#residenceForm").on("submit", function(e) {
      e.preventDefault();

      data.address = $("#address").val();
      data.rent = $("#rent").val();
      data.occupancy = $("#occupancy").val();

      var residence = new Residence();

      residence.save({
        address: data.address,
        formattedAddress: data.formattedAddress,
        coords: data.coords,
        rent: parseInt(data.rent),
        occupancy: data.occupancy
      }, {
        success: function(residence) {
          $('#residenceForm').each(function(){
            this.reset();
          });

          $('#intro').html('Thanks! Feel free to submit more information for residences you know about.')

          getResidences();
        },
        error: function(residence, error) {
        // The save failed.
        // error is a Parse.Error with an error code and message.
        }
      });
      
    });

});