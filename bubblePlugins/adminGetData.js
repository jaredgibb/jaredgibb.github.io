function(properties, context) {
var serviceAccount = <service account file >


var admin = require("firebase-admin");


// Initialize the app with a service account, granting admin privileges
if (!admin.apps.length) {
   initializeApp(serviceAccount)
}

function initializeApp(serviceAccount) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://login-database-brc.firebaseio.com"
   });
}


function getData() {
   var promise = admin.database().ref('BRC/4jV39aEK6jOecLdKONJMKatsEYn1/data').once("value");

   promise.then(snapshot => {
      let element = snapshot.val()
      let list = []
      for (var key in element) {
         list.push(element[key].Name)
      };
       list.push('this is returned')
      return list;
   })
      .catch(error => {
         return error
      });

   return promise;
}



var thepromise;

getData().then((list) => {
   var thepromise = list
	thepromise.push()
      
})

   return {"data":thepromise};

}
//the code specific to bubble is the 
//
//  function(properties, context) {}
//and 
//  return{"data":thepromise}
