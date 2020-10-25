function kmToMiles(km) { return (km * 0.62137).toFixed(2); }
function toRad(v) { return v * Math.PI / 180; }
var l2 = LatLong(-85, 42);


function LatLong(lat, lon) {
    return { Latitude: lat, Longitude: lon }
}

function haversine(l1, l2) {
    var R = 6371; /*km*/
    var x1 = l2.Latitude - l1.location[0];
    var dLat = toRad(x1);
    var x2 = l2.Longitude - l1.location[1];
    var dLon = toRad(x2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(l1.location[0])) * Math.cos(toRad(l2.Latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

var message = '{ "City": "Homs", "Country": "Syria", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(36.72 34.73)", "population": 1005000, "location": [36.72, 34.73] }, { "City": "Cologne", "Country": "Germany", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(6.95 50.93)", "population": 1004000, "location": [6.95, 50.93] }, { "City": "Qinhuangdao", "Country": "China", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(119.62 39.9304)", "population": 1003000, "location": [119.62, 39.9304] }, { "City": "Fès", "Country": "Morocco", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(-5.0004 34.0546)", "population": 1002000, "location": [-5.0004, 34.0546] }, { "City": "Yongzhou", "Country": "China", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(111.62 26.2304)", "population": 1000000, "location": [111.62, 26.2304] }, { "City": "Baoshan", "Country": "China", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(99.15 25.12)", "population": 1000000, "location": [99.15, 25.12] }, { "City": "Aden", "Country": "Yemen", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(45.0095 12.7797)", "population": 1000000, "location": [45.0095, 12.7797] }, { "City": "Quảng Hà", "Country": "Vietnam", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(108.25 16.06)", "population": 1000000, "location": [108.25, 16.06] }, { "City": "Cochabamba", "Country": "Bolivia", "location({\"constraints\":[],\"type\":\"POINT\",\"srsId\":4326})": "POINT(-66.17 -17.41)", "population": 1000000, "location": [-66.17, -17.41] }'
console.log(message.split('}, {'))

var object = message;
var returnObjects = [];

message.forEach(element => {
    if (kmToMiles(haversine(element, l2)) > 0) {
        returnObjects.push(element.City + ' is ' + kmToMiles(haversine(element, l2)) + ' f away');
    }
});





			
			/*
			object.forEach(element => {
				if (kmToMiles(haversine(element, l2)) > 0) {
					returnObjects.push(element.City + ' is ' + kmToMiles(haversine(element, l2)) + ' miles away');
				}
			});
			*/