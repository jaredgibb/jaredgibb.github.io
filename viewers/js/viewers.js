let map;
const geoFirestore = new GeoFirestore(firestore);
const geoCollectionRef = geoFirestore.collection('viewers');
let subscription;
const markers = {};
const radius = 40000;

// Query viewers' locations from Firestore
function queryFirestore(location) {
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
}




// Get users location
navigator.geolocation.getCurrentPosition((success) => {
  userLocation = {
    lat: success.coords.latitude,
    lng: success.coords.longitude
  };

waitForElement()
}, console.log);

function waitForElement(){
  if(typeof userLocation !== "undefined"){
    map.setCenter(userLocation);

    new google.maps.Marker({
      position: userLocation,
      map: map,
      icon: './assets/bluedot.png'
    });
  
    // Add viewer's location to Firestore
    getInFirestore(userLocation);
  }
  else{
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


// Initialize Map
function initMap() {
  var userLocation;
  var mapCenter;

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 41.3083,
      lng: -72.9279
    },
    zoom: 8
  });


  





  map.addListener('idle', function () {
    var getCenter = map.getCenter()
    var center = {
      lat: getCenter.lat(),
      lng: getCenter.lng()
    };

    if (!mapCenter || Geokit.distance(mapCenter, center) > (radius * 0.7)) {
      mapCenter = center;
      queryFirestore(center);
    }
  });
}

// Add Marker to Google Maps
function addMarker(key, data) {
  if (!markers[key]) {
    var infowindow = new google.maps.InfoWindow({
      content: data.count + ' people from this area have viewed this page'
    });

    markers[key] = new google.maps.Marker({
      position: {
        lat: data.coordinates.latitude,
        lng: data.coordinates.longitude
      },
      map: map
    });

    markers[key].addListener('click', function () {
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
    var infowindow = new google.maps.InfoWindow({
      content: 'This town is called' + data.city
    });

    markers[key].setPosition({
      lat: data.coordinates.latitude,
      lng: data.coordinates.longitude
    });

    google.maps.event.clearListeners(markers[key], 'click');

    markers[key].addListener('click', function () {
      infowindow.open(map, markers[key]);
    });
  } else {
    addMarker(key, data);
  }
}

function consoleer(a,b,c,d){
  console.log(a + b + c + d)
}



document.getElementById("submitForm").addEventListener("click", function(){
 
  let city = document.getElementById("element_3").value
  let fact = document.getElementById("element_4").value

  //consoleer(_latInput, _lonInput, city, fact)
  thunkIt(city, fact)
});

function thunkIt (cityName, interestingFact){
  userLocation = {
    lat: 42.2014314,
    lng: -85.5905581
  };
  getIntoFirestore(userLocation, cityName, interestingFact);
  console.log('location recieved, trying to send to firestore')
}
//First find if viewer's location is in Firestore
function getIntoFirestore(location, cityName, interestingFact) {
  location.lat = Number(location.lat.toFixed(1));
  location.lng = Number(location.lng.toFixed(1));
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

