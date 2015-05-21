Parse.Cloud.afterSave("Residence", function(request) {

    //Only attempt geocoding if address was not autocompleted
    if (!(request.object.get("formattedAddress"))) {

    var address = request.object.get("address"); 

    var update = function(lat,lng,formattedAddress) {
        var point = new Parse.GeoPoint(lat, lng);

        request.object.set('coords', point);
        request.object.set('formattedAddress',formattedAddress);
        request.object.save();
    }

    var format_address = function(lat,lng) {
        Parse.Cloud.httpRequest({ 
            method: "POST",
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            params: {
                latlng : lat + ',' + lng,
                key: "AIzaSyAjx-1kF28DSk8TihkbNJPkeOQTipuvx3g"
            },
            success: function(httpResponse) {
               
                var response = httpResponse.data;
                var formattedAddress = response.results[0].formatted_address;

                update(lat,lng,formattedAddress)
                
            },
            error: function(httpResponse) {
                console.error('Request failed with response code ' + httpResponse.status);
            }
        });
    }

    Parse.Cloud.httpRequest({
        method: "POST",
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
            address : address + 'Berkeley, CA',
            key: "AIzaSyAjx-1kF28DSk8TihkbNJPkeOQTipuvx3g"
        },
        success: function(httpResponse) {
           
            var response = httpResponse.data;
            var latlng = response.results[0].geometry.location;
            var lat = latlng['lat'];
            var lng = latlng['lng'];
            
            format_address(lat,lng)      

        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });

    }
  
});