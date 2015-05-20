$(document).ready(function() {

  Parse.initialize("sE7D0GSTTE34WwliYKhme6b2Xo2aINTcgSVdgO4E", "7EhupRm9X7M1G9Grqk3cEzbMm7EpJgZzDcbIxMUP");

  var Residence = Parse.Object.extend("Residence");

  $("#residenceForm").on("submit", function(e) {
      e.preventDefault();

      console.log("Handling the submit");
      //add error handling here
      //gather the form data

      var data = {};
      data.address = $("#address").val();
      data.rent = $("#rent").val();
      data.occupancy = $("#occupancy").val();

      var residence = new Residence();

      residence.save({
        address: data.address,
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