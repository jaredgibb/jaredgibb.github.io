let map;
const geoFirestore = new GeoFirestore(firestore);
const geoCollectionRef = geoFirestore.collection('viewers');
let subscription;
const markers = {};
const radius = 50;
let ra = [];
let markersList = []
let infolist;


// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.

// Query viewers' locations from Firestore
function queryFirestore(location) {

    if (markersList.length > 1) {
        markersList.forEach(key => {
            removeMarker(key)
        });
    } else {
        console.log('markers are empty')
    }
    ra = []
    markersList = []
    if (subscription) {
        console.log('Old query subscription cancelled');
        subscription();
        subscription = false;
    }

    const query = geoCollectionRef.near({
        center: new firebase.firestore.GeoPoint(location.lat, location.lng),
        radius
    });

    console.log('New query subscription created');
    subscription = query.onSnapshot((snapshot) => {
        console.log(snapshot.docChanges())

        snapshot.docChanges().forEach((change) => {
            let distance = change.doc.distance * 0.621371192236
            ra.push({
                'placeInformation': change.doc.data(),
                'distanceInMiles': parseFloat(distance.toFixed(1))
            })
        })
        console.log(ra)

        snapshot.docChanges().forEach((change) => {

            switch (change.type) {
                case 'added':
                    console.log('Snapshot detected added marker');
                    return addMarker(change.doc.id, change.doc.data());
                case 'modified':
                    console.log('Snapshot detected modified marker');
                    return updateMarker(change.doc.id, change.doc.data());
                case 'removed':
                    console.log('Snapshot detected removed marker');
                    return removeMarker(change.doc.id, change.doc.data());
                default:
                    break;
            }
        });
    });
    console.log(markersList)
}



// Get users location
navigator.geolocation.getCurrentPosition((success) => {
    userLocation = {
        lat: success.coords.latitude,
        lng: success.coords.longitude
    };

    waitForElement()
}, console.log);

function waitForElement() {
    if (typeof map !== "undefined") {
        map.setCenter(userLocation);

        new google.maps.Marker({
            position: userLocation,
            map: map,
            icon: './assets/bluedot.png'
        });

        // Add viewer's location to Firestore
        getInFirestore(userLocation);
    } else {
        setTimeout(waitForElement, 250);
    }
}


// First find if viewer's location is in Firestore
function getInFirestore(location) {
    location.lat = Number(location.lat.toFixed(1));
    location.lng = Number(location.lng.toFixed(1));
    const hash = Geokit.hash(location);

    geoCollectionRef.doc(hash).get().then((snapshot) => {
        let data = snapshot.data();
        if (!data) {
            data = {
                count: 1,
                coordinates: new firebase.firestore.GeoPoint(location.lat, location.lng),
            };
            console.log('Provided key is not in Firestore, adding document: ', JSON.stringify(data));
            createInFirestore(hash, data);
        } else {
            data.count++;
            console.log('Provided key is in Firestore, updating document: ', JSON.stringify(data));
            updateInFirestore(hash, data);
        }
    }, (error) => {
        console.log('Error: ' + error);
    });
}

// Create/set viewer's location in Firestore
function createInFirestore(key, data) {
    geoCollectionRef.doc(key).set(data).then(() => {
        console.log('Provided document has been added in Firestore');
    }, (error) => {
        console.log('Error: ' + error);
    });
}

// Update viewer's location in Firestore
function updateInFirestore(key, data) {
    geoCollectionRef.doc(key).update(data).then(() => {
        console.log('Provided document has been updated in Firestore');
    }, (error) => {
        console.log('Error: ' + error);
    });
}
let geocoder;
var checkbox = document.querySelector('input[type="checkbox"]');

// Initialize Map
function initMap() {
    geocoder = new google.maps.Geocoder();

    var userLocation;
    var mapCenter;

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 43.3083,
            lng: -85.9279
        },
        zoom: 8


    });

    infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: userLocation,
    });
    infoWindow.open(map);

    //control what happens when a user clicks on the map. this is ultimately dependent upon the toggle. 
    //first get the lat and long, then do something with it
    map.addListener("click", (mapsMouseEvent) => {
        let a;
        let b;
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        // infoWindow = new google.maps.InfoWindow({
        //   position: mapsMouseEvent.latLng,
        // });
        // infoWindow.setContent(
        //   JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        // );
        // infoWindow.open(map);

        a = mapsMouseEvent.latLng.toJSON().lat
        b = mapsMouseEvent.latLng.toJSON().lng
        parseFloat(a)
        parseFloat(b)
        document.getElementById("element_1").value = a
        document.getElementById("element_2").value = b

        /* if the toggle is on, what to do*/
        if (checkbox.checked) {
            geocodeLatLng(a, b)

        } else {

            /*what to do if the toggle is off get currrent location*/
            userLocation = {
                lat: parseFloat(a),
                lng: parseFloat(b)
            };

            //set new center of map
            map.setCenter(userLocation);

            setMapOnAll(null)
            queryFirestore(userLocation)

            // //add center marker
            // new google.maps.Marker({
            //   position: userLocation,
            //   map: map,
            //   icon: './assets/bluedot.png'
            // }); 


        }


    });

    map.addListener('idle', function() {
        var getCenter = map.getCenter()


        var center = {
            lat: getCenter.lat(),
            lng: getCenter.lng()
        };

        if (!mapCenter || Geokit.distance(mapCenter, center) > (radius * 0.7)) {
            mapCenter = center;
            queryFirestore(center);
            console.log('new query')
        }


    });
}

// Add Marker to Google Maps
function addMarker(key, data) {

    markersList.push(key)
    if (!markers[key]) {

        infowindow = new google.maps.InfoWindow({
            content: 'City: ' + data.city + '\n' + 'Fact: ' + data.fact
        });



        markers[key] = new google.maps.Marker({
            position: {
                lat: data.coordinates.latitude,
                lng: data.coordinates.longitude
            },
            map: map
        });



        markers[key].addListener('click', function() {

            infowindow.open(map, markers[key]);
        });
    }
}


// Remove Marker to Google Maps
function removeMarker(key) {
    if (markers[key]) {
        google.maps.event.clearListeners(markers[key], 'click');
        markers[key].setMap(null);
        markers[key] = null;
    }
}


// Update Marker on Google Maps
function updateMarker(key, data) {
    if (markers[key]) {
        infowindow = new google.maps.InfoWindow({
            content: 'This town is called' + data.city
        });

        markers[key].setPosition({
            lat: data.coordinates.latitude,
            lng: data.coordinates.longitude
        });

        google.maps.event.clearListeners(markers[key], 'click');

        markers[key].addListener('click', function() {
            infowindow.open(map, markers[key]);
        });
    } else {
        addMarker(key, data);
    }
}

function consoleer(a, b, c, d) {
    console.log(a + b + c + d)
}


///when you click submit, send form location to firestore and add marker to the map
document.getElementById("submitForm").addEventListener("click", function() {
    thunkIt()
});

function thunkIt() {
    let one = document.getElementById("element_1").value
    let two = document.getElementById("element_2").value
    let cityName = document.getElementById("element_3").value
    let interestingFact = document.getElementById("element_4").value
    document.getElementById("element_1").value = ""
    document.getElementById("element_2").value = ""
    document.getElementById("element_3").value = ""
    document.getElementById("element_4").value = ""

    userLocation = {
        lat: one,
        lng: two
    };
    getIntoFirestore(userLocation, cityName, interestingFact);
    console.log('location recieved, trying to send to firestore')
}
//First find if location is in Firestore
function getIntoFirestore(location, cityName, interestingFact) {
    location.lat = parseFloat(location.lat);
    location.lng = parseFloat(location.lng);
    const hash = Geokit.hash(location);

    geoCollectionRef.doc(hash).get().then((snapshot) => {
        let data = snapshot.data();
        if (!data) {
            data = {
                count: 1,
                coordinates: new firebase.firestore.GeoPoint(location.lat, location.lng),
                city: cityName,
                fact: interestingFact
            };
            console.log('Provided key is not in Firestore, adding document: ', JSON.stringify(data));
            createIntoFirestore(hash, data);
        } else {
            data.count++;
            console.log('Provided key is in Firestore, updating document: ', JSON.stringify(data));
            updateIntoFirestore(hash, data);
        }
    }, (error) => {
        console.log('Error: ' + error);
    });
}


function createIntoFirestore(key, data) {
    geoCollectionRef.doc(key).set(data).then(() => {
        console.log('Provided document has been added in Firestore');
    }, (error) => {
        console.log('Error: ' + error);
    });
}

/// Update viewer's location in Firestore
function updateIntoFirestore(key, data) {
    geoCollectionRef.doc(key).update(data).then(() => {
        console.log('Provided document has been updated in Firestore');
    }, (error) => {
        console.log('Error: ' + error);
    });
}

let returnAddress;

function geocodeLatLng(lat, lng) {
    let latlng = {
        lat: lat,
        lng: lng,
    };
    geocoder.geocode({
        location: latlng
    }, (results, status) => {
        if (status === "OK") {
            if (results[0]) {

                console.log(results[0].address_components[2].long_name)
                //console.log(JSON.stringify(results))
                document.getElementById("element_3").value = results[0].address_components[2].long_name;

            } else {
                console.log("No results found");
            }
        } else {
            console.log("Geocoder failed due to: " + status);
        }
    });
}