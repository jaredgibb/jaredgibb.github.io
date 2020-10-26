(function() {
  // Initialize the Firebase SDK
  firebase.initializeApp({
    apiKey: "AIzaSyDZo2qz-IQy3utS3ytJtLpadrJi4GJ_UGQ",
    databaseURL: "https://mine-acb0b.firebaseio.com/",
    projectId: "mine-acb0b"
  });

  // Generate a random Firebase location
  var firebaseRef = firebase.database().ref('/locations');

  // Create a new GeoFire instance at the random Firebase location
  var geoFireInstance = new geofire.GeoFire(firebaseRef);
  var geoQuery;

  $("#addfish").on("submit", function() {
    var lat = parseFloat($("#addlat").val());
    var lon = parseFloat($("#addlon").val());
   // var myID = "fish-" + firebaseRef.push().key;
    var myID = $("#name").val()+'-'+ firebaseRef.push().key;
    var poop = $("#name").val()

    geoFireInstance.set({"id":myID, "position":[lat, lon],"name":poop}).then(function() {
      log(myID + ": setting position to [" + lat + "," + lon + "]");
    });

    return false;
  });

  $("#queryfish").on("submit", function() {
    var lat = parseFloat($("#querylat").val());
    var lon = parseFloat($("#querylon").val());
    var radius = parseFloat($("#queryradius").val());
    var operation;

    if (typeof geoQuery !== "undefined") {
      operation = "Updating";

      geoQuery.updateCriteria({
        center: [lat, lon],
        radius: radius
      });

    } else {
      operation = "Creating";

      geoQuery = geoFireInstance.query({
        center: [lat, lon],
        radius: radius
      });

      geoQuery.on("key_entered", function(key, location, distance) {
        log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
      });

      geoQuery.on("key_exited", function(key, location, distance) {
        console.log(key, location, distance);
        log(key + " is located at [" + location + "] which is no longer within the query (" + distance.toFixed(2) + " km from center)");
      });
    }

    log(operation + " the query: centered at [" + lat + "," + lon + "] with radius of " + radius + "km")

    return false;
  });

  /*************/
  /*  HELPERS  */
  /*************/
  /* Logs to the page instead of the console */
  function log(message) {
    var childDiv = document.createElement("div");
    var textNode = document.createTextNode(message);
    childDiv.appendChild(textNode);
    document.getElementById("log").appendChild(childDiv);
  }
})();